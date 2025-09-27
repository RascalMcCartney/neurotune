import React, { useState, useEffect, useMemo } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, ChevronLeft, ChevronRight, Upload, X, Search, Filter, Piano, Activity, ArrowUpDown } from 'lucide-react';
import FolderManage from '../components/FolderManage';
import MusicalKeyboard from '../components/MusicalKeyboard';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';
import BPMFilter from '../components/BPMFilter';
import GenreFilter from '../components/GenreFilter';
import SortFilter from '../components/SortFilter';
import AddTrackDropdown from '../components/AddTrackDropdown';
import StorageStatus from '../components/StorageStatus';
import type { Track, TrackOperation, Folder } from '../types/folder';

// Sample data
const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: "3:42",
    genre: "Electronic",
    year: 2023,
    bpm: 128,
    key: "C Major",
    energy: 0.8,
    danceability: 0.9,
    valence: 0.7,
    popularity: 85,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    album: "Seaside Sessions",
    duration: "4:15",
    genre: "Ambient",
    year: 2022,
    bpm: 85,
    key: "A Minor",
    energy: 0.4,
    danceability: 0.3,
    valence: 0.6,
    popularity: 72,
    imageUrl: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 3,
    title: "City Lights",
    artist: "Urban Pulse",
    album: "Metropolitan",
    duration: "3:28",
    genre: "Hip Hop",
    year: 2023,
    bpm: 95,
    key: "F# Minor",
    energy: 0.7,
    danceability: 0.8,
    valence: 0.5,
    popularity: 91,
    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 4,
    title: "Golden Hour",
    artist: "Sunset Collective",
    album: "Warm Memories",
    duration: "5:03",
    genre: "Indie Folk",
    year: 2021,
    bpm: 72,
    key: "G Major",
    energy: 0.5,
    danceability: 0.4,
    valence: 0.8,
    popularity: 68,
    imageUrl: "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 5,
    title: "Electric Storm",
    artist: "Thunder Bay",
    album: "Weather Patterns",
    duration: "4:37",
    genre: "Rock",
    year: 2023,
    bpm: 140,
    key: "E Major",
    energy: 0.9,
    danceability: 0.6,
    valence: 0.4,
    popularity: 79,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 6,
    title: "Velvet Dreams",
    artist: "Smooth Operators",
    album: "Late Night Jazz",
    duration: "6:12",
    genre: "Jazz",
    year: 2022,
    bpm: 88,
    key: "Bb Major",
    energy: 0.3,
    danceability: 0.5,
    valence: 0.7,
    popularity: 64,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 7,
    title: "Neon Nights",
    artist: "Synthwave Collective",
    album: "Retro Future",
    duration: "4:44",
    genre: "Synthwave",
    year: 2023,
    bpm: 118,
    key: "D Minor",
    energy: 0.8,
    danceability: 0.7,
    valence: 0.6,
    popularity: 82,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 8,
    title: "Mountain Echo",
    artist: "Alpine Sounds",
    album: "High Altitude",
    duration: "5:28",
    genre: "Folk",
    year: 2021,
    bpm: 76,
    key: "C# Minor",
    energy: 0.4,
    danceability: 0.3,
    valence: 0.5,
    popularity: 58,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 9,
    title: "Digital Love",
    artist: "Cyber Hearts",
    album: "Virtual Reality",
    duration: "3:55",
    genre: "Electronic",
    year: 2023,
    bpm: 124,
    key: "A Major",
    energy: 0.7,
    danceability: 0.8,
    valence: 0.9,
    popularity: 87,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 10,
    title: "Starlight Serenade",
    artist: "Cosmic Orchestra",
    album: "Celestial Sounds",
    duration: "7:15",
    genre: "Classical",
    year: 2022,
    bpm: 60,
    key: "F Major",
    energy: 0.2,
    danceability: 0.1,
    valence: 0.8,
    popularity: 71,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 11,
    title: "Bass Drop",
    artist: "Heavy Beats",
    album: "Club Anthems",
    duration: "3:33",
    genre: "EDM",
    year: 2023,
    bpm: 130,
    key: "G# Minor",
    energy: 0.95,
    danceability: 0.9,
    valence: 0.6,
    popularity: 93,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 12,
    title: "Acoustic Sunrise",
    artist: "Morning Glory",
    album: "Dawn Sessions",
    duration: "4:21",
    genre: "Acoustic",
    year: 2021,
    bpm: 82,
    key: "D Major",
    energy: 0.6,
    danceability: 0.4,
    valence: 0.9,
    popularity: 75,
    imageUrl: "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 13,
    title: "Midnight Runner",
    artist: "Neon Shadows",
    album: "Dark Streets",
    duration: "4:12",
    genre: "Synthwave",
    year: 2023,
    bpm: 115,
    key: "Am",
    energy: 0.75,
    danceability: 0.65,
    valence: 0.4,
    popularity: 78,
    imageUrl: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 14,
    title: "Summer Breeze",
    artist: "Coastal Vibes",
    album: "Endless Summer",
    duration: "3:58",
    genre: "Indie Pop",
    year: 2022,
    bpm: 92,
    key: "C Major",
    energy: 0.6,
    danceability: 0.7,
    valence: 0.85,
    popularity: 82,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 15,
    title: "Thunder Road",
    artist: "Electric Highway",
    album: "Road Warriors",
    duration: "5:24",
    genre: "Rock",
    year: 2023,
    bpm: 138,
    key: "E Minor",
    energy: 0.9,
    danceability: 0.55,
    valence: 0.6,
    popularity: 88,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 16,
    title: "Whispered Dreams",
    artist: "Luna Moth",
    album: "Ethereal",
    duration: "6:45",
    genre: "Ambient",
    year: 2021,
    bpm: 68,
    key: "F# Major",
    energy: 0.25,
    danceability: 0.2,
    valence: 0.7,
    popularity: 65,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 17,
    title: "Beat Drop",
    artist: "Bass Masters",
    album: "Heavy Hitters",
    duration: "3:21",
    genre: "EDM",
    year: 2023,
    bpm: 128,
    key: "G Minor",
    energy: 0.95,
    danceability: 0.92,
    valence: 0.8,
    popularity: 91,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 18,
    title: "Coffee Shop Blues",
    artist: "Morning Jazz Trio",
    album: "Café Sessions",
    duration: "4:33",
    genre: "Jazz",
    year: 2022,
    bpm: 75,
    key: "Bb Major",
    energy: 0.4,
    danceability: 0.45,
    valence: 0.6,
    popularity: 69,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 19,
    title: "Pixel Dreams",
    artist: "8-Bit Heroes",
    album: "Retro Gaming",
    duration: "2:47",
    genre: "Chiptune",
    year: 2023,
    bpm: 140,
    key: "C# Minor",
    energy: 0.8,
    danceability: 0.75,
    valence: 0.9,
    popularity: 73,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 20,
    title: "Moonlight Sonata Remix",
    artist: "Classical Beats",
    album: "Modern Classics",
    duration: "5:12",
    genre: "Classical Crossover",
    year: 2022,
    bpm: 95,
    key: "C# Minor",
    energy: 0.65,
    danceability: 0.5,
    valence: 0.3,
    popularity: 77,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 21,
    title: "Desert Wind",
    artist: "Sahara Sounds",
    album: "Nomadic",
    duration: "4:56",
    genre: "World",
    year: 2021,
    bpm: 85,
    key: "D Minor",
    energy: 0.5,
    danceability: 0.6,
    valence: 0.55,
    popularity: 62,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 22,
    title: "Neon Lights",
    artist: "City Pulse",
    album: "Urban Nights",
    duration: "3:44",
    genre: "Electronic",
    year: 2023,
    bpm: 122,
    key: "A Minor",
    energy: 0.85,
    danceability: 0.88,
    valence: 0.7,
    popularity: 86,
    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 23,
    title: "Acoustic Memories",
    artist: "Campfire Stories",
    album: "Unplugged",
    duration: "4:18",
    genre: "Folk",
    year: 2022,
    bpm: 78,
    key: "G Major",
    energy: 0.45,
    danceability: 0.35,
    valence: 0.8,
    popularity: 71,
    imageUrl: "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 24,
    title: "Bass Revolution",
    artist: "Sub Frequency",
    album: "Low End Theory",
    duration: "3:36",
    genre: "Dubstep",
    year: 2023,
    bpm: 140,
    key: "F Minor",
    energy: 0.98,
    danceability: 0.85,
    valence: 0.6,
    popularity: 89,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 25,
    title: "Velvet Voice",
    artist: "Smooth Jazz Collective",
    album: "Midnight Sessions",
    duration: "5:47",
    genre: "Jazz",
    year: 2021,
    bpm: 72,
    key: "Eb Major",
    energy: 0.3,
    danceability: 0.4,
    valence: 0.65,
    popularity: 68,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 26,
    title: "Digital Horizon",
    artist: "Future Waves",
    album: "Cyber Dreams",
    duration: "4:02",
    genre: "Synthwave",
    year: 2023,
    bpm: 118,
    key: "B Minor",
    energy: 0.75,
    danceability: 0.7,
    valence: 0.65,
    popularity: 81,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 27,
    title: "Mountain High",
    artist: "Alpine Echo",
    album: "Peak Experience",
    duration: "5:33",
    genre: "Folk",
    year: 2022,
    bpm: 82,
    key: "D Major",
    energy: 0.55,
    danceability: 0.4,
    valence: 0.75,
    popularity: 64,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 28,
    title: "Groove Machine",
    artist: "Funk Factory",
    album: "Get Down",
    duration: "3:52",
    genre: "Funk",
    year: 2023,
    bpm: 108,
    key: "E Major",
    energy: 0.8,
    danceability: 0.9,
    valence: 0.85,
    popularity: 84,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 29,
    title: "Stargazer",
    artist: "Cosmic Drift",
    album: "Interstellar",
    duration: "6:28",
    genre: "Ambient",
    year: 2021,
    bpm: 65,
    key: "A Major",
    energy: 0.3,
    danceability: 0.25,
    valence: 0.7,
    popularity: 59,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 30,
    title: "Electric Feel",
    artist: "Voltage",
    album: "High Energy",
    duration: "3:29",
    genre: "Electronic",
    year: 2023,
    bpm: 126,
    key: "F# Minor",
    energy: 0.9,
    danceability: 0.85,
    valence: 0.8,
    popularity: 87,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 31,
    title: "Rainy Day Blues",
    artist: "Storm Chasers",
    album: "Weather Report",
    duration: "4:41",
    genre: "Blues",
    year: 2022,
    bpm: 88,
    key: "G Minor",
    energy: 0.5,
    danceability: 0.45,
    valence: 0.35,
    popularity: 66,
    imageUrl: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 32,
    title: "Sunset Drive",
    artist: "Highway Dreams",
    album: "Open Road",
    duration: "4:15",
    genre: "Indie Rock",
    year: 2023,
    bpm: 95,
    key: "C Major",
    energy: 0.7,
    danceability: 0.6,
    valence: 0.8,
    popularity: 79,
    imageUrl: "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 33,
    title: "Techno Paradise",
    artist: "Digital Underground",
    album: "Circuit Board",
    duration: "5:18",
    genre: "Techno",
    year: 2023,
    bpm: 132,
    key: "A Minor",
    energy: 0.95,
    danceability: 0.9,
    valence: 0.7,
    popularity: 85,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 34,
    title: "Gentle Rain",
    artist: "Nature Sounds",
    album: "Peaceful Moments",
    duration: "7:22",
    genre: "Ambient",
    year: 2021,
    bpm: 60,
    key: "F Major",
    energy: 0.2,
    danceability: 0.1,
    valence: 0.6,
    popularity: 52,
    imageUrl: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 35,
    title: "Hip Hop Nation",
    artist: "Street Poets",
    album: "Urban Stories",
    duration: "3:48",
    genre: "Hip Hop",
    year: 2023,
    bpm: 98,
    key: "Bb Minor",
    energy: 0.75,
    danceability: 0.8,
    valence: 0.6,
    popularity: 88,
    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 36,
    title: "Classical Fusion",
    artist: "Modern Orchestra",
    album: "Timeless",
    duration: "6:15",
    genre: "Classical",
    year: 2022,
    bpm: 70,
    key: "D Minor",
    energy: 0.6,
    danceability: 0.3,
    valence: 0.5,
    popularity: 63,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 37,
    title: "Reggae Sunshine",
    artist: "Island Vibes",
    album: "Tropical Breeze",
    duration: "4:07",
    genre: "Reggae",
    year: 2022,
    bpm: 75,
    key: "G Major",
    energy: 0.6,
    danceability: 0.75,
    valence: 0.9,
    popularity: 76,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 38,
    title: "Midnight Express",
    artist: "Night Train",
    album: "Last Call",
    duration: "4:44",
    genre: "Blues Rock",
    year: 2023,
    bpm: 110,
    key: "E Minor",
    energy: 0.8,
    danceability: 0.65,
    valence: 0.45,
    popularity: 72,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 39,
    title: "Cosmic Dance",
    artist: "Space Disco",
    album: "Galaxy Groove",
    duration: "5:33",
    genre: "Disco",
    year: 2023,
    bpm: 118,
    key: "F Major",
    energy: 0.85,
    danceability: 0.95,
    valence: 0.9,
    popularity: 83,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 40,
    title: "Forest Whispers",
    artist: "Earth Sounds",
    album: "Natural Harmony",
    duration: "8:12",
    genre: "New Age",
    year: 2021,
    bpm: 55,
    key: "C Major",
    energy: 0.25,
    danceability: 0.15,
    valence: 0.75,
    popularity: 48,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 41,
    title: "Punk Revolution",
    artist: "Rebel Youth",
    album: "Anarchy",
    duration: "2:58",
    genre: "Punk",
    year: 2023,
    bpm: 165,
    key: "A Major",
    energy: 0.95,
    danceability: 0.7,
    valence: 0.8,
    popularity: 74,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 42,
    title: "Smooth Operator",
    artist: "Silk Road",
    album: "Sophisticated",
    duration: "4:26",
    genre: "R&B",
    year: 2022,
    bpm: 85,
    key: "Bb Major",
    energy: 0.55,
    danceability: 0.7,
    valence: 0.7,
    popularity: 80,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 43,
    title: "Trance State",
    artist: "Mind Bender",
    album: "Hypnotic",
    duration: "7:45",
    genre: "Trance",
    year: 2023,
    bpm: 138,
    key: "G# Minor",
    energy: 0.9,
    danceability: 0.85,
    valence: 0.75,
    popularity: 82,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 44,
    title: "Country Roads",
    artist: "Backwood Boys",
    album: "Hometown",
    duration: "3:54",
    genre: "Country",
    year: 2022,
    bpm: 92,
    key: "D Major",
    energy: 0.6,
    danceability: 0.65,
    valence: 0.8,
    popularity: 67,
    imageUrl: "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 45,
    title: "Metal Storm",
    artist: "Iron Thunder",
    album: "Heavy Metal",
    duration: "4:33",
    genre: "Metal",
    year: 2023,
    bpm: 155,
    key: "E Minor",
    energy: 0.98,
    danceability: 0.5,
    valence: 0.4,
    popularity: 78,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 46,
    title: "Lofi Study",
    artist: "Chill Beats",
    album: "Focus Mode",
    duration: "3:22",
    genre: "Lo-fi",
    year: 2023,
    bpm: 70,
    key: "Am",
    energy: 0.3,
    danceability: 0.4,
    valence: 0.6,
    popularity: 85,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 47,
    title: "Salsa Fire",
    artist: "Latin Heat",
    album: "Baile",
    duration: "4:18",
    genre: "Latin",
    year: 2022,
    bpm: 105,
    key: "C Minor",
    energy: 0.85,
    danceability: 0.95,
    valence: 0.9,
    popularity: 79,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 48,
    title: "Indie Dreams",
    artist: "Bedroom Pop",
    album: "Nostalgic",
    duration: "3:47",
    genre: "Indie Pop",
    year: 2023,
    bpm: 88,
    key: "F Major",
    energy: 0.5,
    danceability: 0.6,
    valence: 0.75,
    popularity: 73,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 49,
    title: "House Party",
    artist: "DJ Groove",
    album: "Club Mix",
    duration: "5:12",
    genre: "House",
    year: 2023,
    bpm: 125,
    key: "G Major",
    energy: 0.9,
    danceability: 0.92,
    valence: 0.85,
    popularity: 89,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 50,
    title: "Orchestral Epic",
    artist: "Symphony Hall",
    album: "Grand Performance",
    duration: "9:33",
    genre: "Classical",
    year: 2021,
    bpm: 80,
    key: "Bb Major",
    energy: 0.7,
    danceability: 0.2,
    valence: 0.6,
    popularity: 61,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 51,
    title: "Trap Beat",
    artist: "Street Sound",
    album: "Urban Trap",
    duration: "3:15",
    genre: "Trap",
    year: 2023,
    bpm: 140,
    key: "F# Minor",
    energy: 0.85,
    danceability: 0.8,
    valence: 0.65,
    popularity: 86,
    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 52,
    title: "Bossa Nova Sunset",
    artist: "Rio Nights",
    album: "Brazilian Breeze",
    duration: "4:52",
    genre: "Bossa Nova",
    year: 2022,
    bpm: 78,
    key: "A Major",
    energy: 0.4,
    danceability: 0.6,
    valence: 0.8,
    popularity: 69,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 53,
    title: "Synthpop Revival",
    artist: "Neon Nights",
    album: "80s Forever",
    duration: "3:38",
    genre: "Synthpop",
    year: 2023,
    bpm: 115,
    key: "D Minor",
    energy: 0.75,
    danceability: 0.8,
    valence: 0.7,
    popularity: 81,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 54,
    title: "Grunge Anthem",
    artist: "Flannel Shirt",
    album: "90s Revival",
    duration: "4:21",
    genre: "Grunge",
    year: 2023,
    bpm: 98,
    key: "E Minor",
    energy: 0.8,
    danceability: 0.55,
    valence: 0.5,
    popularity: 75,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 55,
    title: "Meditation Flow",
    artist: "Inner Peace",
    album: "Mindfulness",
    duration: "12:00",
    genre: "Meditation",
    year: 2021,
    bpm: 45,
    key: "C Major",
    energy: 0.1,
    danceability: 0.05,
    valence: 0.8,
    popularity: 44,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 56,
    title: "Afrobeat Rhythm",
    artist: "Lagos Groove",
    album: "African Spirit",
    duration: "5:44",
    genre: "Afrobeat",
    year: 2022,
    bpm: 112,
    key: "G Minor",
    energy: 0.8,
    danceability: 0.9,
    valence: 0.85,
    popularity: 77,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 57,
    title: "Drum & Bass Rush",
    artist: "Liquid Motion",
    album: "High Speed",
    duration: "4:33",
    genre: "Drum & Bass",
    year: 2023,
    bpm: 174,
    key: "A Minor",
    energy: 0.95,
    danceability: 0.85,
    valence: 0.7,
    popularity: 84,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 58,
    title: "Folk Tale",
    artist: "Storyteller",
    album: "Ancient Songs",
    duration: "6:18",
    genre: "Folk",
    year: 2021,
    bpm: 68,
    key: "D Major",
    energy: 0.4,
    danceability: 0.3,
    valence: 0.7,
    popularity: 58,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 59,
    title: "Garage Beat",
    artist: "Underground UK",
    album: "Street Level",
    duration: "3:42",
    genre: "UK Garage",
    year: 2023,
    bpm: 130,
    key: "Bb Minor",
    energy: 0.85,
    danceability: 0.88,
    valence: 0.75,
    popularity: 76,
    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 60,
    title: "Psychedelic Journey",
    artist: "Mind Expansion",
    album: "Cosmic Trip",
    duration: "8:47",
    genre: "Psychedelic",
    year: 2022,
    bpm: 85,
    key: "F# Major",
    energy: 0.6,
    danceability: 0.4,
    valence: 0.6,
    popularity: 65,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 61,
    title: "Minimal Techno",
    artist: "Berlin Underground",
    album: "Warehouse",
    duration: "6:22",
    genre: "Minimal Techno",
    year: 2023,
    bpm: 128,
    key: "C Minor",
    energy: 0.8,
    danceability: 0.85,
    valence: 0.5,
    popularity: 72,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 62,
    title: "Gospel Choir",
    artist: "Heavenly Voices",
    album: "Spiritual",
    duration: "5:15",
    genre: "Gospel",
    year: 2022,
    bpm: 95,
    key: "F Major",
    energy: 0.7,
    danceability: 0.6,
    valence: 0.9,
    popularity: 63,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 63,
    title: "Breakbeat Madness",
    artist: "Rhythm Breaker",
    album: "Broken Beats",
    duration: "4:08",
    genre: "Breakbeat",
    year: 2023,
    bpm: 145,
    key: "G# Minor",
    energy: 0.9,
    danceability: 0.8,
    valence: 0.7,
    popularity: 74,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 64,
    title: "Celtic Winds",
    artist: "Highland Mist",
    album: "Scottish Tales",
    duration: "4:55",
    genre: "Celtic",
    year: 2021,
    bpm: 72,
    key: "D Minor",
    energy: 0.5,
    danceability: 0.45,
    valence: 0.65,
    popularity: 56,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 65,
    title: "Future Bass Drop",
    artist: "Bass Future",
    album: "Tomorrow's Sound",
    duration: "3:51",
    genre: "Future Bass",
    year: 2023,
    bpm: 150,
    key: "E Major",
    energy: 0.9,
    danceability: 0.85,
    valence: 0.8,
    popularity: 88,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 66,
    title: "Swing Time",
    artist: "Big Band Revival",
    album: "Dance Hall",
    duration: "3:33",
    genre: "Swing",
    year: 2022,
    bpm: 120,
    key: "Bb Major",
    energy: 0.75,
    danceability: 0.9,
    valence: 0.85,
    popularity: 68,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 67,
    title: "Hardstyle Anthem",
    artist: "Hard Energy",
    album: "Festival Hits",
    duration: "4:44",
    genre: "Hardstyle",
    year: 2023,
    bpm: 150,
    key: "A Minor",
    energy: 0.98,
    danceability: 0.8,
    valence: 0.75,
    popularity: 81,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 68,
    title: "Ambient Space",
    artist: "Void Explorer",
    album: "Deep Space",
    duration: "11:22",
    genre: "Ambient",
    year: 2021,
    bpm: 50,
    key: "F# Major",
    energy: 0.15,
    danceability: 0.1,
    valence: 0.6,
    popularity: 47,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 69,
    title: "Ska Punk Energy",
    artist: "Brass Rebellion",
    album: "Upstroke",
    duration: "2:48",
    genre: "Ska Punk",
    year: 2023,
    bpm: 180,
    key: "F Major",
    energy: 0.95,
    danceability: 0.85,
    valence: 0.9,
    popularity: 73,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 70,
    title: "Chillwave Sunset",
    artist: "Retro Dreams",
    album: "Nostalgic Waves",
    duration: "4:36",
    genre: "Chillwave",
    year: 2022,
    bpm: 85,
    key: "C# Major",
    energy: 0.4,
    danceability: 0.5,
    valence: 0.75,
    popularity: 71,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 71,
    title: "Industrial Noise",
    artist: "Machine Works",
    album: "Factory Floor",
    duration: "5:27",
    genre: "Industrial",
    year: 2023,
    bpm: 125,
    key: "G Minor",
    energy: 0.9,
    danceability: 0.6,
    valence: 0.3,
    popularity: 64,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 72,
    title: "Bluegrass Picking",
    artist: "Mountain String Band",
    album: "Appalachian",
    duration: "3:44",
    genre: "Bluegrass",
    year: 2022,
    bpm: 140,
    key: "G Major",
    energy: 0.7,
    danceability: 0.6,
    valence: 0.8,
    popularity: 59,
    imageUrl: "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 73,
    title: "Vaporwave Aesthetic",
    artist: "Neon Mall",
    album: "Digital Nostalgia",
    duration: "6:33",
    genre: "Vaporwave",
    year: 2023,
    bpm: 65,
    key: "Eb Major",
    energy: 0.3,
    danceability: 0.4,
    valence: 0.6,
    popularity: 67,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 74,
    title: "Post Rock Epic",
    artist: "Instrumental Collective",
    album: "Cinematic",
    duration: "8:15",
    genre: "Post Rock",
    year: 2021,
    bpm: 95,
    key: "D Minor",
    energy: 0.75,
    danceability: 0.3,
    valence: 0.5,
    popularity: 62,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 75,
    title: "Dancehall Vibes",
    artist: "Kingston Sound",
    album: "Jamaican Heat",
    duration: "3:28",
    genre: "Dancehall",
    year: 2023,
    bpm: 90,
    key: "A Minor",
    energy: 0.8,
    danceability: 0.9,
    valence: 0.85,
    popularity: 83,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 76,
    title: "Shoegaze Dream",
    artist: "Reverb Cloud",
    album: "Ethereal Noise",
    duration: "5:52",
    genre: "Shoegaze",
    year: 2022,
    bpm: 88,
    key: "F# Minor",
    energy: 0.6,
    danceability: 0.4,
    valence: 0.45,
    popularity: 58,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 77,
    title: "Electro Swing",
    artist: "Vintage Electric",
    album: "Retro Future",
    duration: "3:41",
    genre: "Electro Swing",
    year: 2023,
    bpm: 128,
    key: "C Major",
    energy: 0.8,
    danceability: 0.9,
    valence: 0.9,
    popularity: 79,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 78,
    title: "Doom Metal",
    artist: "Heavy Darkness",
    album: "Eternal Void",
    duration: "7:33",
    genre: "Doom Metal",
    year: 2023,
    bpm: 65,
    key: "C# Minor",
    energy: 0.85,
    danceability: 0.2,
    valence: 0.2,
    popularity: 61,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 79,
    title: "Tropical House",
    artist: "Island Beats",
    album: "Paradise",
    duration: "4:18",
    genre: "Tropical House",
    year: 2022,
    bpm: 100,
    key: "G Major",
    energy: 0.7,
    danceability: 0.8,
    valence: 0.9,
    popularity: 85,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 80,
    title: "Noise Rock",
    artist: "Sonic Chaos",
    album: "Distortion",
    duration: "4:07",
    genre: "Noise Rock",
    year: 2023,
    bpm: 110,
    key: "B Minor",
    energy: 0.95,
    danceability: 0.4,
    valence: 0.3,
    popularity: 55,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 81,
    title: "Smooth Jazz",
    artist: "Midnight Saxophone",
    album: "Late Night",
    duration: "5:44",
    genre: "Smooth Jazz",
    year: 2021,
    bpm: 75,
    key: "Ab Major",
    energy: 0.4,
    danceability: 0.5,
    valence: 0.7,
    popularity: 66,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 82,
    title: "Glitch Hop",
    artist: "Digital Glitch",
    album: "System Error",
    duration: "3:55",
    genre: "Glitch Hop",
    year: 2023,
    bpm: 110,
    key: "F Minor",
    energy: 0.8,
    danceability: 0.75,
    valence: 0.6,
    popularity: 72,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 83,
    title: "Mongolian Folk",
    artist: "Steppe Riders",
    album: "Ancient Winds",
    duration: "6:22",
    genre: "World Music",
    year: 2022,
    bpm: 68,
    key: "D Minor",
    energy: 0.6,
    danceability: 0.4,
    valence: 0.6,
    popularity: 51,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 84,
    title: "Neurofunk Bass",
    artist: "Brain Frequency",
    album: "Neural Network",
    duration: "4:41",
    genre: "Neurofunk",
    year: 2023,
    bpm: 174,
    key: "G# Minor",
    energy: 0.95,
    danceability: 0.8,
    valence: 0.5,
    popularity: 69,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 85,
    title: "Emo Revival",
    artist: "Heartbreak Hotel",
    album: "Feelings",
    duration: "3:33",
    genre: "Emo",
    year: 2023,
    bpm: 95,
    key: "E Minor",
    energy: 0.7,
    danceability: 0.5,
    valence: 0.3,
    popularity: 68,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 86,
    title: "Flamenco Guitar",
    artist: "Spanish Fire",
    album: "Passion",
    duration: "4:28",
    genre: "Flamenco",
    year: 2022,
    bpm: 120,
    key: "A Minor",
    energy: 0.8,
    danceability: 0.7,
    valence: 0.75,
    popularity: 63,
    imageUrl: "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 87,
    title: "Liquid DnB",
    artist: "Smooth Flow",
    album: "Liquid State",
    duration: "5:17",
    genre: "Liquid DnB",
    year: 2023,
    bpm: 172,
    key: "F Major",
    energy: 0.75,
    danceability: 0.8,
    valence: 0.8,
    popularity: 76,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 88,
    title: "Math Rock",
    artist: "Complex Time",
    album: "Odd Signatures",
    duration: "4:44",
    genre: "Math Rock",
    year: 2022,
    bpm: 145,
    key: "C# Minor",
    energy: 0.8,
    danceability: 0.3,
    valence: 0.5,
    popularity: 57,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 89,
    title: "Synthfunk Groove",
    artist: "Retro Funk",
    album: "Digital Funk",
    duration: "4:12",
    genre: "Synthfunk",
    year: 2023,
    bpm: 108,
    key: "Bb Major",
    energy: 0.8,
    danceability: 0.9,
    valence: 0.85,
    popularity: 78,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 90,
    title: "Dark Ambient",
    artist: "Shadow Realm",
    album: "Void",
    duration: "9:18",
    genre: "Dark Ambient",
    year: 2021,
    bpm: 40,
    key: "F# Minor",
    energy: 0.1,
    danceability: 0.05,
    valence: 0.2,
    popularity: 42,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 91,
    title: "Kawaii Future Bass",
    artist: "Cute Beats",
    album: "Pastel Dreams",
    duration: "3:47",
    genre: "Kawaii Future Bass",
    year: 2023,
    bpm: 150,
    key: "C Major",
    energy: 0.85,
    danceability: 0.8,
    valence: 0.95,
    popularity: 81,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 92,
    title: "Stoner Rock",
    artist: "Desert Highway",
    album: "Hazy Days",
    duration: "6:33",
    genre: "Stoner Rock",
    year: 2022,
    bpm: 75,
    key: "E Minor",
    energy: 0.7,
    danceability: 0.4,
    valence: 0.6,
    popularity: 64,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 93,
    title: "Acid House",
    artist: "303 Machine",
    album: "Acid Trip",
    duration: "5:55",
    genre: "Acid House",
    year: 2023,
    bpm: 125,
    key: "G Minor",
    energy: 0.9,
    danceability: 0.9,
    valence: 0.7,
    popularity: 74,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 94,
    title: "Blackgaze",
    artist: "Ethereal Darkness",
    album: "Beautiful Despair",
    duration: "7:22",
    genre: "Blackgaze",
    year: 2022,
    bpm: 85,
    key: "D Minor",
    energy: 0.75,
    danceability: 0.3,
    valence: 0.4,
    popularity: 56,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 95,
    title: "Phonk Beat",
    artist: "Memphis Sound",
    album: "Underground",
    duration: "2:44",
    genre: "Phonk",
    year: 2023,
    bpm: 140,
    key: "F# Minor",
    energy: 0.85,
    danceability: 0.8,
    valence: 0.5,
    popularity: 79,
    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 96,
    title: "Witch House",
    artist: "Occult Synth",
    album: "Dark Magic",
    duration: "4:33",
    genre: "Witch House",
    year: 2023,
    bpm: 65,
    key: "Bb Minor",
    energy: 0.6,
    danceability: 0.5,
    valence: 0.3,
    popularity: 58,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 97,
    title: "Melodic Dubstep",
    artist: "Emotional Bass",
    album: "Feels",
    duration: "4:18",
    genre: "Melodic Dubstep",
    year: 2023,
    bpm: 140,
    key: "A Major",
    energy: 0.85,
    danceability: 0.75,
    valence: 0.8,
    popularity: 86,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 98,
    title: "Power Metal",
    artist: "Dragon Force",
    album: "Epic Quest",
    duration: "5:47",
    genre: "Power Metal",
    year: 2022,
    bpm: 180,
    key: "E Major",
    energy: 0.95,
    danceability: 0.5,
    valence: 0.8,
    popularity: 71,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 99,
    title: "Chillstep",
    artist: "Peaceful Bass",
    album: "Serenity",
    duration: "4:55",
    genre: "Chillstep",
    year: 2023,
    bpm: 70,
    key: "C# Major",
    energy: 0.4,
    danceability: 0.5,
    valence: 0.75,
    popularity: 73,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 100,
    title: "Speedcore",
    artist: "Extreme BPM",
    album: "Maximum Velocity",
    duration: "3:12",
    genre: "Speedcore",
    year: 2023,
    bpm: 300,
    key: "C Minor",
    energy: 1.0,
    danceability: 0.6,
    valence: 0.7,
    popularity: 62,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 101,
    title: "Ambient Dub",
    artist: "Echo Chamber",
    album: "Spacious",
    duration: "8:44",
    genre: "Ambient Dub",
    year: 2021,
    bpm: 90,
    key: "G Major",
    energy: 0.35,
    danceability: 0.4,
    valence: 0.65,
    popularity: 54,
    imageUrl: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 102,
    title: "Garage Punk",
    artist: "Raw Energy",
    album: "DIY",
    duration: "2:33",
    genre: "Garage Punk",
    year: 2023,
    bpm: 155,
    key: "A Major",
    energy: 0.9,
    danceability: 0.7,
    valence: 0.75,
    popularity: 67,
    imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 103,
    title: "Synthpop Ballad",
    artist: "Neon Hearts",
    album: "Electric Love",
    duration: "4:47",
    genre: "Synthpop",
    year: 2022,
    bpm: 85,
    key: "F Major",
    energy: 0.5,
    danceability: 0.6,
    valence: 0.8,
    popularity: 75,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 104,
    title: "Brutal Death Metal",
    artist: "Extreme Chaos",
    album: "Annihilation",
    duration: "3:28",
    genre: "Death Metal",
    year: 2023,
    bpm: 220,
    key: "C# Minor",
    energy: 1.0,
    danceability: 0.3,
    valence: 0.1,
    popularity: 53,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 105,
    title: "Lounge Jazz",
    artist: "Cocktail Hour",
    album: "Sophisticated",
    duration: "5:22",
    genre: "Lounge",
    year: 2022,
    bpm: 68,
    key: "Bb Major",
    energy: 0.3,
    danceability: 0.4,
    valence: 0.7,
    popularity: 61,
    imageUrl: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 106,
    title: "Experimental Electronic",
    artist: "Sound Laboratory",
    album: "Research",
    duration: "6:55",
    genre: "Experimental",
    year: 2023,
    bpm: 95,
    key: "F# Minor",
    energy: 0.6,
    danceability: 0.4,
    valence: 0.5,
    popularity: 49,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 107,
    title: "Surf Rock",
    artist: "Beach Riders",
    album: "Endless Summer",
    duration: "3:18",
    genre: "Surf Rock",
    year: 2022,
    bpm: 125,
    key: "E Major",
    energy: 0.75,
    danceability: 0.65,
    valence: 0.85,
    popularity: 69,
    imageUrl: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 108,
    title: "Darksynth",
    artist: "Neon Nightmare",
    album: "Cyberpunk",
    duration: "4:33",
    genre: "Darksynth",
    year: 2023,
    bpm: 120,
    key: "D Minor",
    energy: 0.8,
    danceability: 0.7,
    valence: 0.4,
    popularity: 76,
    imageUrl: "https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 109,
    title: "Progressive Trance",
    artist: "Uplifting Spirits",
    album: "Journey",
    duration: "8:22",
    genre: "Progressive Trance",
    year: 2023,
    bpm: 132,
    key: "A Minor",
    energy: 0.85,
    danceability: 0.8,
    valence: 0.8,
    popularity: 82,
    imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 110,
    title: "Drone Metal",
    artist: "Infinite Sustain",
    album: "Eternal Tone",
    duration: "12:47",
    genre: "Drone Metal",
    year: 2021,
    bpm: 45,
    key: "F Minor",
    energy: 0.6,
    danceability: 0.1,
    valence: 0.2,
    popularity: 38,
    imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 111,
    title: "Future Funk",
    artist: "Disco Future",
    album: "Retro Tomorrow",
    duration: "3:44",
    genre: "Future Funk",
    year: 2023,
    bpm: 115,
    key: "C Major",
    energy: 0.8,
    danceability: 0.9,
    valence: 0.9,
    popularity: 84,
    imageUrl: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 112,
    title: "Atmospheric Black Metal",
    artist: "Winter Forest",
    album: "Frozen Landscapes",
    duration: "9:15",
    genre: "Atmospheric Black Metal",
    year: 2022,
    bpm: 75,
    key: "Bb Minor",
    energy: 0.7,
    danceability: 0.2,
    valence: 0.3,
    popularity: 52,
    imageUrl: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  year: number;
  bpm: number;
  key: string;
  energy: number;
  danceability: number;
  valence: number;
  popularity: number;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const [tracks] = useState<Track[]>(sampleTracks);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(sampleTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortCriteria, setSortCriteria] = useState([{ field: 'title', direction: 'asc' as 'asc' | 'desc', priority: 1 }]);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [selectedMusicalKey, setSelectedMusicalKey] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showBPMFilter, setShowBPMFilter] = useState(false);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [bpmMin, setBpmMin] = useState<number | null>(null);
  const [bpmMax, setBpmMax] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  { /* const [showSplash, setShowSplash] = useState(true); */ }
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 12;

  // Get unique genres for filter dropdown
  const genres = Array.from(new Set(tracks.map(track => track.genre))).sort();

  const trendingTracks = [
    {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'Luna Eclipse',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      genre: 'Electronic',
      duration: '3:45',
      isNew: true
    },
    {
      id: '2',
      title: 'Ocean Waves',
      artist: 'Coastal Vibes',
      image: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg',
      genre: 'Ambient',
      duration: '4:12',
      isHot: true
    },
    {
      id: '3',
      title: 'Electric Storm',
      artist: 'Voltage',
      image: 'https://images.pexels.com/photos/1540319/pexels-photo-1540319.jpeg',
      genre: 'EDM',
      duration: '3:28',
      isNew: true
    },
    {
      id: '4',
      title: 'Desert Sunrise',
      artist: 'Nomad Soul',
      image: 'https://images.pexels.com/photos/358238/pexels-photo-358238.jpeg',
      genre: 'World',
      duration: '5:02'
    },
    {
      id: '5',
      title: 'Neon Lights',
      artist: 'Synthwave Collective',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
      genre: 'Synthwave',
      duration: '4:35',
      isHot: true
    },
    {
      id: '6',
      title: 'Mountain Echo',
      artist: 'Alpine Sounds',
      image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
      genre: 'Folk',
      duration: '3:18'
    },
    {
      id: '7',
      title: 'City Pulse',
      artist: 'Urban Beats',
      image: 'https://images.pexels.com/photos/1876279/pexels-photo-1876279.jpeg',
      genre: 'Hip Hop',
      duration: '3:55',
      isNew: true
    },
    {
      id: '8',
      title: 'Starlight Symphony',
      artist: 'Cosmic Orchestra',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg',
      genre: 'Classical',
      duration: '6:42'
    }
  ];

  // Auto-scroll carousel
  useEffect(() => {
    if (!isCarouselPaused) {
      const interval = setInterval(() => {
        const carousel = document.getElementById('trending-carousel');
        if (carousel) {
          const scrollAmount = 320; // Width of one card plus gap
          const maxScroll = carousel.scrollWidth - carousel.clientWidth;
          
          if (carousel.scrollLeft >= maxScroll) {
            // Reset to beginning
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll to next item
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 3000); // Scroll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isCarouselPaused]);
  
  const handleAddTrack = () => {
    console.log('Add track clicked');
    setShowAddDialog(true);
  };

  const handleImportFolder = () => {
    console.log('Import folder clicked');
    // Handle folder import logic
  };
  
  const handleBPMRangeChange = (minBPM: number | null, maxBPM: number | null) => {
    setBpmMin(minBPM);
    setBpmMax(maxBPM);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  useEffect(() => {
    { /* // Auto-close splash after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      setShowSplash(false);
    }, 400000); */ }

    let filtered = tracks.filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          track.album.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === '' || track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    // Filter by musical key
    if (selectedMusicalKey) {
      filtered = filtered.filter(track => track.key === selectedMusicalKey);
    }

    // Filter by BPM range
    if (bpmMin !== null || bpmMax !== null) {
      filtered = filtered.filter(track => {
        if (bpmMin !== null && track.bpm < bpmMin) return false;
        if (bpmMax !== null && track.bpm > bpmMax) return false;
        return true;
      });
    }

    // Sort tracks with multiple criteria
    filtered.sort((a, b) => {
      for (const criteria of sortCriteria) {
        let comparison = 0;
        
        switch (criteria.field) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'artist':
            comparison = a.artist.localeCompare(b.artist);
            break;
          case 'album':
            comparison = a.album.localeCompare(b.album);
            break;
          case 'genre':
            comparison = a.genre.localeCompare(b.genre);
            break;
          case 'year':
            comparison = a.year - b.year;
            break;
          case 'duration':
            // Convert duration string to seconds for comparison
            const aDuration = a.duration.split(':').reduce((acc, time) => (60 * acc) + +time);
            const bDuration = b.duration.split(':').reduce((acc, time) => (60 * acc) + +time);
            comparison = aDuration - bDuration;
            break;
          case 'bpm':
            comparison = a.bpm - b.bpm;
            break;
          case 'key':
            comparison = a.key.localeCompare(b.key);
            break;
          case 'energy':
            comparison = a.energy - b.energy;
            break;
          case 'popularity':
            comparison = a.popularity - b.popularity;
            break;
          default:
            comparison = 0;
        }
        
        // Apply direction
        if (criteria.direction === 'desc') {
          comparison = -comparison;
        }
        
        // If this criteria produces a non-zero result, return it
        if (comparison !== 0) {
          return comparison;
        }
        
        // If comparison is 0, continue to next criteria
      }
      
      // If all criteria result in 0, items are equal
      return 0;
    });

    setFilteredTracks(filtered);

  }, [tracks, searchTerm, selectedGenre, sortCriteria, selectedMusicalKey, bpmMin, bpmMax]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTracks.length / tracksPerPage);
  const startIndex = (currentPage - 1) * tracksPerPage;
  const endIndex = startIndex + tracksPerPage;
  const currentTracks = filteredTracks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre]);

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file.name);
    }
  };

  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null);
  const [folderTracks] = React.useState<Track[]>([
    { id: '1', name: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55' },
    { id: '2', name: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: '8:02' },
    { id: '3', name: 'Hotel California', artist: 'Eagles', duration: '6:30' },
    { id: '4', name: 'Imagine', artist: 'John Lennon', duration: '3:07' },
    { id: '5', name: 'Sweet Child O Mine', artist: 'Guns N Roses', duration: '5:03' }
  ]);

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const handleMoveTrack = (trackId: string, folderId: string | null) => {
    // Implementation for moving tracks between folders
    console.log('Moving track', trackId, 'to folder', folderId);
  };
  const handleTrackOperation = (operation: TrackOperation) => {
    switch (operation.type) {
      case 'copy':
        if (operation.targetFolderId !== undefined) {
          const tracksToCopy = tracks.filter(track => operation.trackIds.includes(track.id));
          const copiedTracks = tracksToCopy.map(track => ({
            ...track,
            id: `${track.id}_copy_${Date.now()}`,
            name: `${track.name} (Copy)`,
            folder_id: operation.targetFolderId,
            date_added: new Date().toISOString().split('T')[0]
          }));
          setTracks([...tracks, ...copiedTracks]);
        }
        break;
      
      case 'move':
        if (operation.targetFolderId !== undefined) {
          setTracks(tracks.map(track => 
            operation.trackIds.includes(track.id) 
              ? { ...track, folder_id: operation.targetFolderId }
              : track
          ));
        }
        break;
      
      case 'delete':
        setTracks(tracks.filter(track => !operation.trackIds.includes(track.id)));
        if (currentTrack && operation.trackIds.includes(currentTrack.id)) {
          setCurrentTrack(null);
          setIsPlaying(false);
        }
        break;
      
      case 'duplicate':
        const tracksToDuplicate = tracks.filter(track => operation.trackIds.includes(track.id));
        const duplicatedTracks = tracksToDuplicate.map(track => ({
          ...track,
          id: `${track.id}_dup_${Date.now()}`,
          name: `${track.name} (Copy)`,
          date_added: new Date().toISOString().split('T')[0]
        }));
        setTracks([...tracks, ...duplicatedTracks]);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AuthHeader />

{/* New Music Carousel */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
        Discover Your Sound
      </h1>
      <p className="text-lg text-gray-300 max-w-4xl mb-2">
        Explore, analyse, and organise your music collection with powerful tools and insights
      </p>
    </div>

    {/* Add Track Button */}
    <div className="mt-4 lg:mt-0 lg:ml-6 w-[190px]">
      <AddTrackDropdown 
        onImportFolder={handleImportFolder}
        onAddTrack={handleAddTrack}
      />
    </div>
  </div>
</div>

        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-bold text-white">New & Trending</h4>
          </div>
          
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div 
                id="trending-carousel"
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {sampleTracks.slice(0, 12).map((track) => (
                  <div key={track.id} className="flex-none w-64 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 group hover:transform hover:scale-105">
                    <div className="relative">
                      <img
                        src={track.imageUrl}
                        alt={track.title}
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handlePlay(track)}
                          className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors duration-200"
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm mb-1 truncate">{track.title}</h3>
                      <p className="text-purple-200 text-xs mb-2 truncate">{track.artist}</p>
                      
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>{track.genre}</span>
                        <span>{track.duration}</span>
                      </div>
                      
                      <div className="mt-2 flex justify-between text-xs">
                        <span className="text-white/60">Energy</span>
                        <span className="text-purple-300">{Math.round(track.energy * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${track.energy * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1">
                          <button className="text-white/60 hover:text-red-400 transition-colors duration-200">
                            <Heart className="w-3 h-3" />
                          </button>
                          <button className="text-white/60 hover:text-blue-400 transition-colors duration-200">
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < Math.round(track.popularity / 20) 
                                  ? 'bg-yellow-400' 
                                  : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Fade Effects */}
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-slate-900 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6 space-y-4 relative z-10">
          {/* Search Row */}
          <div className="w-full">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Search tracks, artists, albums..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Genre Filter */}
              <button
                onClick={() => setShowGenreFilter(true)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  selectedGenre && selectedGenre !== 'All Genres'
                    ? 'bg-orange-600 border-orange-500 text-white'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Music className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedGenre || 'Genre'}
                </span>
              </button>

              {/* Musical Key Filter */}
              <button
                onClick={() => setShowKeyboard(true)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  selectedMusicalKey
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Piano className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedMusicalKey ? `Key: ${selectedMusicalKey}` : 'Musical Key'}
                </span>
              </button>

              {/* BPM Filter */}
              <button
                onClick={() => setShowBPMFilter(true)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  bpmMin !== null || bpmMax !== null
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {(bpmMin !== null || bpmMax !== null) 
                    ? `BPM: ${bpmMin || '0'}-${bpmMax || '∞'}` 
                    : 'BPM Range'
                  }
                </span>
              </button>

            </div>
            
            {(searchTerm || selectedMusicalKey || selectedFolderId || bpmMin !== null || bpmMax !== null) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMusicalKey(null);
                  setSelectedFolderId(null);
                  setBpmMin(null);
                  setBpmMax(null);
                }}
                className="flex items-center px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Musical Keyboard Popup */}
      <MusicalKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onKeySelect={setSelectedMusicalKey}
        selectedKey={selectedMusicalKey}
      />

      {/* Genre Filter Popup */}
      <GenreFilter
        isOpen={showGenreFilter}
        onClose={() => setShowGenreFilter(false)}
        onGenreChange={setSelectedGenre}
        selectedGenre={selectedGenre}
      />
      
      {/* BPM Filter Popup */}
      <BPMFilter
        isOpen={showBPMFilter}
        onClose={() => setShowBPMFilter(false)}
        onBPMRangeChange={handleBPMRangeChange}
        currentMinBPM={bpmMin}
        currentMaxBPM={bpmMax}
      />

      {/* Sort Filter Popup */}
      <SortFilter
        isOpen={showSortFilter}
        onClose={() => setShowSortFilter(false)}
        onSortChange={handleSortChange}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Folder Management - Left Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <FolderManage 
                onFolderSelect={setSelectedFolderId}
                selectedFolderId={selectedFolderId}
                tracks={sampleTracks}
              />
            </div>
          </div>

          {/* Track Cards - Right Column */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedFolderId ? 'Filtered Tracks' : 'All Tracks'}
                <span className="text-blue-300 text-sm">
                  ({currentTracks.length} tracks)
                </span>
              </h2>
              <div className="flex items-center space-x-2">
                <StorageStatus />
                <button
                  onClick={() => setShowSortFilter(true)}
                  className="flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Sort: {sortCriteria.length > 0 ? (
                      <>
                        {sortCriteria.map((criteria, index) => {
                          const fieldLabels = {
                            'title': 'Title', 'artist': 'Artist', 'album': 'Album', 'genre': 'Genre',
                            'year': 'Year', 'duration': 'Duration', 'bpm': 'BPM', 'key': 'Key',
                            'energy': 'Energy', 'popularity': 'Popularity'
                          };
                          return `${fieldLabels[criteria.field as keyof typeof fieldLabels] || criteria.field} ${criteria.direction === 'asc' ? '↑' : '↓'}`;
                        }).join(', ')}
                      </>
                    ) : 'None'}
                  </span>
                </button>
              </div>
            </div>

            {/* Track Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentTracks.map((track) => (
                <div key={track.id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 group hover:transform hover:scale-105">
                  {/* Musical Key Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {track.key}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={track.imageUrl}
                      alt={track.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handlePlay(track)}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200"
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 pt-8">
                    <h3 className="font-bold text-white text-lg mb-1 truncate">{track.title}</h3>
                    <p className="text-purple-200 mb-2 truncate">{track.artist}</p>
                    <p className="text-white/60 text-sm mb-3 truncate">{track.album}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-white/80 mb-3">
                      <div>Genre: <span className="text-purple-300">{track.genre}</span></div>
                      <div>Year: <span className="text-purple-300">{track.year}</span></div>
                      <div>BPM: <span className="text-purple-300">{track.bpm}</span></div>
                      <div>Key: <span className="text-purple-300">{track.key}</span></div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Energy</span>
                        <span className="text-purple-300">{Math.round(track.energy * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${track.energy * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Danceability</span>
                        <span className="text-purple-300">{Math.round(track.danceability * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${track.danceability * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Valence</span>
                        <span className="text-purple-300">{Math.round(track.valence * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${track.valence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="text-white/60 hover:text-red-400 transition-colors duration-200">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="text-white/60 hover:text-blue-400 transition-colors duration-200">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < Math.round(track.popularity / 20) 
                                  ? 'bg-yellow-400' 
                                  : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-white/60 ml-1">{track.popularity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Now Playing Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentTrack.imageUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="text-white font-medium">{currentTrack.title}</h4>
                <p className="text-white/60 text-sm">{currentTrack.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-white/60 hover:text-white transition-colors duration-200">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white text-black rounded-full p-2 hover:bg-white/90 transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button className="text-white/60 hover:text-white transition-colors duration-200">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-white/60" />
              <div className="w-24 bg-white/20 rounded-full h-1">
                <div className="bg-white h-1 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add & Analyse Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add & Analyse Track</h2>
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center transition-colors duration-200">
                    <X className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* File Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Upload Audio File
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors duration-200">
                  <div className="flex flex-col items-center">
                    <div className="bg-purple-500/20 rounded-full p-3 mb-3">
                      <Upload className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-white mb-2">Drop your MP3 file here or click to browse</p>
                    <p className="text-white/60 text-sm mb-4">Maximum file size: 10MB</p>
                    <input
                      type="file"
                      accept=".mp3"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                      Choose File
                    </label>
                    {selectedFile && (
                      <p className="text-green-400 text-sm mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Track Metadata Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Track Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter track title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artist
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter artist name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Album
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter album name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="3:45"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="2024"
                      min="1900"
                      max="2030"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select genre</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="hip-hop">Hip Hop</option>
                    <option value="electronic">Electronic</option>
                    <option value="jazz">Jazz</option>
                    <option value="classical">Classical</option>
                    <option value="country">Country</option>
                    <option value="r&b">R&B</option>
                    <option value="indie">Indie</option>
                    <option value="alternative">Alternative</option>
                    <option value="folk">Folk</option>
                    <option value="reggae">Reggae</option>
                    <option value="blues">Blues</option>
                    <option value="metal">Metal</option>
                    <option value="punk">Punk</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Audio Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Audio Features</h3>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Energy: 75%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Danceability: 80%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Valence: 65%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="65"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Popularity: 70%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="70"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all duration-200">
                  Analyse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default HomePage;