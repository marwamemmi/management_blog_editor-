const express = require('express');
const app = express();
const knexConfig = require('./db/knexfile'); // Adjust the path accordingly
const knex = require('knex')(knexConfig)
const multer = require('multer');
const path = require('path')
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const Blog = require('./models/blog');
const http = require('http');
const { createBlog } = require('./models/blog');
const { createContent } = require('./models/content');
//const {storage} = require('./middleware/storage')
app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // Autorise les requêtes depuis ce domaine
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Autorise les méthodes HTTP spécifiées
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Autorise les en-têtes spécifiés
  next();
});
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Définir le stockage et le nom du fichier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Correct path to the folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // File name
  },
});

const upload = multer({
  storage: storage,
});

app.post('/addblogs', upload.single('Blogimage'),upload.single('image'), async (req, res) => {
  const { blog, content , tags } = req.body;
  const { Blogimage, image } = req.files;
  //const Blogimage = req.file; // Access uploaded file using req.file
 // const Image = req.files;
  
  console.log('Blogimage:', Blogimage);
  console.log('Image:', Image);
  
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  // if (req.file) {
  //   fs.writeFileSync('uploads/' + req.file.filename, req.file.buffer);
  // }
  try {
    const createdBlog = await knex.transaction(async (trx) => {
      // Insert the blog data first and retrieve the inserted blog
      const [blogResult] = await trx('blog').insert({
        ...blog,
        Blogimage: Date.now() + '-' + Blogimage.name,
        tags: JSON.stringify(tags) ,
      }).returning('*');

      // Insert the content data with the blog_id pointing to the inserted blog
      const [contentResult] = await trx('content').insert({
        ...content,
       image: Date.now() + '-' + image.name,
        blog_id: blogResult.id,
      }).returning('*');

      // Update the content_id in the inserted blog with the actual content's ID
      const [updatedBlog] = await trx('blog')
        .where('id', blogResult.id)
        .update({ content_id: contentResult.id })
        .returning('*');

      return { ...updatedBlog, content: contentResult };
    });

    res.status(201).json({ message: 'Blog post created successfully', blog: createdBlog });
  } catch (error) {
    console.error('Error creating blog post', error);
    res.status(500).json({ error: 'An error occurred while creating the blog post' });
  }
});

// app.post('/addblogs', upload.single('Blogimage'),upload.single('image'), async (req, res) => {
//   const { title, url , description ,  tags  , content  , url1 } = req.body;
//   //const { Blogimage, image } = req.files;

//   console.log('Request Body:', req.body);
//   console.log('Request File:', req.file);
//   // if (req.file) {
//   //   fs.writeFileSync('uploads/' + req.file.filename, req.file.buffer);
//   // }
//   try {
//     const createdBlog = await knex.transaction(async (trx) => {
//       // Insert the blog data first and retrieve the inserted blog
//       const [blogResult] = await trx('blog').insert({
//        title:title,
//        url:url,
//        description :description,
//        tags:JSON.stringify(tags),
//        // Blogimage: Date.now() + '-' + Blogimage.name,

        
//       }).returning('*');

//       // Insert the content data with the blog_id pointing to the inserted blog
//       const [contentResult] = await trx('content').insert({
//         content:content,
//        // image:Date.now() + '-' + image.name,
//         url1:url1,
//         blog_id: blogResult.id,
//       }).returning('*');

//       // Update the content_id in the inserted blog with the actual content's ID
//       const [updatedBlog] = await trx('blog')
//         .where('id', blogResult.id)
//         .update({ content_id: contentResult.id })
//         .returning('*');

//       return { ...updatedBlog, content: contentResult };
//     });

//     res.status(201).json({ message: 'Blog post created successfully', blog: createdBlog });
//   } catch (error) {
//     console.error('Error creating blog post', error);
//     res.status(500).json({ error: 'An error occurred while creating the blog post' });
//   }
// });


app.get('/blogs', async (req, res) => {
  try {
    const blogs = await knex('blog')
      .select('blog.*', 'content.*') // Select columns from both tables
      .leftJoin('content', 'blog.id', 'content.blog_id'); // Join based on foreign key

    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching blogs' });
  }
});


app.get('/blogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await knex('blog')
      .select('blog.*', 'content.*') // Select columns from both tables
      .leftJoin('content', 'blog.id', 'content.blog_id') // Join based on foreign key
      .where('blog.id', blogId)
      .first();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error fetching the blog:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching the blog' });
  }
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
