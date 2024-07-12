

const logger = require('morgan');

const { DiffieHellmanGroup } = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));
app.use(cors());
const PORT = 4000;

// MongoDB connection URL
const DB_URL = "mongodb+srv://test:test@cluster0.pzgke6c.mongodb.net/spotifyweb"


const { MongoClient } = require('mongodb');


app.get('/songs', async (req, res) => {
    const client = new MongoClient(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      const artistName = req.query.artist_name;
      const difficulty = req.query.difficulty;
      console.log('Connected to the database');
      console.log("difficulty: " + difficulty);
     
      
      console.info(artistName);

      
  
      if (!artistName || !difficulty) {
        return res.status(400).json({ error: 'Missing artist parameter' });
      }
  
     
        const database = client.db();
        const collection = database.collection('artists');
        

       
        const query = { artist_name: artistName };
        

      
        const songs = await collection.find(query).toArray();
    
  
      if (songs.length === 0) {
        return res.status(404).json({ error: 'No songs found for the specified artist' + " " + artistName });
      }

      const formattedSongs = songs.map(song => ({
        track_name: song.track_name,
        artist_name: song.artist_name,
        track_id: song.track_id,
        popularity: song.pooularity
      }));

      const sortedSongs = formattedSongs.sort((a, b) => b.popularity - a.popularity);

        
        let diff = .05;
        if(difficulty === "hard"){
          diff = .9;
        }
        else if(difficulty === "medium"){
          diff = .45;
        }
        else if(difficulty === "hard"){
          diff = .05;
        }
        const percentIndex = Math.ceil(diff * sortedSongs.length);

        
        const percentSongs = sortedSongs.slice(0, percentIndex);

      const randomIndex = Math.floor(Math.random() * percentSongs.length);
      const randomSong = percentSongs[randomIndex];
  
      res.json(randomSong);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

     finally {
    
    await client.close();
    console.log('Disconnected from the database');
    }
  });

  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

