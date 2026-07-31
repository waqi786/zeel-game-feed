import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";
import { hashPassword } from "../src/utils/bcrypt.js";

const prisma = new PrismaClient();
const root = process.cwd();
const gamesRoot = path.join(root, "uploads", "games");

const titles = [
  "Cyber Grid",
  "Orbit Dash",
  "Neon Runner",
  "Space Jump",
  "Color Switch",
  "Brick Breaker",
  "Dashy Bird",
  "Tunnel Rush",
  "Pixel Kart",
  "Blade Hop",
  "Comet Slide",
  "Crystal Drift",
  "Rocket Stack",
  "Pulse Maze",
  "Turbo Tiles",
  "Arc Rider",
  "Laser Drift",
  "Lane Rush",
  "Shadow Flip",
  "Nova Switch",
  "Metro Surf",
  "Temple Sprint",
  "Sky Flap",
  "Tower Stack",
  "Candy Match",
  "Block Puzzle",
  "Bubble Pop",
  "Knife Flip",
  "Basket Flick",
  "Goal Strike",
  "Moto Rush",
  "Drift King",
  "Highway Racer",
  "Tank Arena",
  "Galaxy Shooter",
  "Asteroid Tap",
  "Zombie Dodge",
  "Ninja Slice",
  "Fruit Dash",
  "Piano Beat",
  "Rhythm Tiles",
  "Snake Grid",
  "Mine Maze",
  "Word Quest",
  "Chess Blitz",
  "Pinball Neon",
  "Pool Strike",
  "Golf Flick",
  "Boxing Tap",
  "Tennis Rally",
  "Dunk Shot",
  "Island Merge",
  "Farm Rush",
  "Cooking Sprint",
  "Pet Rescue",
  "Jewel Swap",
  "Mystery Room",
  "Escape Door",
  "Dragon Flight",
  "Hero Jump",
  "Robot Arena",
  "Space Miner",
  "Rail Runner",
  "Snow Slide",
  "Water Jet",
  "City Builder",
  "Color Hoop",
  "Light Maze",
  "Laser Link",
  "Gravity Flip"
];

const genres = ["Action", "Puzzle", "Racing", "Arcade", "Runner", "Shooter", "Sports", "Strategy", "Rhythm", "Adventure"];
const mechanics = [
  "grid",
  "orbit",
  "runner",
  "jump",
  "switch",
  "breaker",
  "bird",
  "tunnel",
  "kart",
  "blade",
  "comet",
  "crystal",
  "rocket",
  "maze",
  "tiles",
  "arc",
  "laser",
  "lane",
  "shadow",
  "nova"
];

const popularThemes = [
  { title: "Slope Rush", genre: "Runner", mechanic: "runner" },
  { title: "2048 Merge", genre: "Puzzle", mechanic: "tiles" },
  { title: "Flappy Flight", genre: "Arcade", mechanic: "bird" },
  { title: "Doodle Jump", genre: "Arcade", mechanic: "jump" },
  { title: "Paper Trail", genre: "Strategy", mechanic: "lane" },
  { title: "Snake Grid", genre: "Arcade", mechanic: "grid" },
  { title: "Block Stacktris", genre: "Puzzle", mechanic: "stack" },
  { title: "Fruit Slice", genre: "Action", mechanic: "blade" },
  { title: "Crossy Hop", genre: "Arcade", mechanic: "lane" },
  { title: "Bubble Popper", genre: "Puzzle", mechanic: "switch" },
  { title: "Maze Chaser", genre: "Arcade", mechanic: "maze" },
  { title: "Mine Builder", genre: "Adventure", mechanic: "crystal" },
  { title: "Rope Cut", genre: "Puzzle", mechanic: "orbit" },
  { title: "Sonic Dashline", genre: "Runner", mechanic: "runner" },
  { title: "Zuma Spiral", genre: "Puzzle", mechanic: "orbit" },
  { title: "Mahjong Match", genre: "Puzzle", mechanic: "tiles" },
  { title: "Solitaire Flip", genre: "Strategy", mechanic: "stack" },
  { title: "Temple Sprint", genre: "Runner", mechanic: "runner" },
  { title: "Angry Launcher", genre: "Action", mechanic: "arc" },
  { title: "Helix Drop", genre: "Arcade", mechanic: "orbit" },
  { title: "Tower Stack", genre: "Arcade", mechanic: "stack" },
  { title: "Color Switch", genre: "Arcade", mechanic: "switch" },
  { title: "Geometry Beat", genre: "Rhythm", mechanic: "jump" },
  { title: "Subway Dash", genre: "Runner", mechanic: "lane" },
  { title: "Candy Swap", genre: "Puzzle", mechanic: "tiles" },
  { title: "Piano Tiles", genre: "Rhythm", mechanic: "tiles" },
  { title: "Bottle Flip", genre: "Arcade", mechanic: "jump" },
  { title: "Dino Run", genre: "Runner", mechanic: "runner" },
  { title: "Drift Hunters", genre: "Racing", mechanic: "kart" },
  { title: "Moto Ramp", genre: "Racing", mechanic: "kart" },
  { title: "Football Legends", genre: "Sports", mechanic: "arc" },
  { title: "Basket Flick", genre: "Sports", mechanic: "arc" },
  { title: "Pool Strike", genre: "Sports", mechanic: "orbit" },
  { title: "Space Invaders", genre: "Shooter", mechanic: "laser" },
  { title: "Tank Trouble", genre: "Shooter", mechanic: "grid" },
  { title: "Pinball Master", genre: "Arcade", mechanic: "breaker" },
  { title: "Reaction Sprint", genre: "Arcade", mechanic: "runner" },
  { title: "Simon Pulse", genre: "Puzzle", mechanic: "switch" },
  { title: "Typing Rush", genre: "Rhythm", mechanic: "tiles" },
  { title: "Whack Mole", genre: "Action", mechanic: "grid" },
  { title: "Memory Match", genre: "Puzzle", mechanic: "tiles" },
  { title: "Bomber Grid", genre: "Action", mechanic: "grid" },
  { title: "Slither Trail", genre: "Arcade", mechanic: "lane" },
  { title: "Red Ball", genre: "Platformer", mechanic: "jump" },
  { title: "Fire Water Duel", genre: "Platformer", mechanic: "lane" },
  { title: "Pixel Shooter", genre: "Shooter", mechanic: "laser" },
  { title: "Geometry Rash", genre: "Rhythm", mechanic: "jump" },
  { title: "Traffic Jam", genre: "Racing", mechanic: "lane" },
  { title: "Two Cars", genre: "Racing", mechanic: "lane" },
  { title: "Penalty Kick", genre: "Sports", mechanic: "arc" },
  { title: "Chess Blitz", genre: "Strategy", mechanic: "grid" },
  { title: "Ludo Dash", genre: "Board", mechanic: "grid" },
  { title: "Tic Tac Toe", genre: "Board", mechanic: "grid" },
  { title: "Word Quest", genre: "Word", mechanic: "tiles" },
  { title: "Sudoku Sprint", genre: "Puzzle", mechanic: "grid" },
  { title: "Minesweeper", genre: "Puzzle", mechanic: "grid" },
  { title: "Rocket Blumgi", genre: "Arcade", mechanic: "rocket" },
  { title: "Blazing Kart", genre: "Racing", mechanic: "kart" },
  { title: "Galaxy Shooter", genre: "Shooter", mechanic: "laser" },
  { title: "Shadow Ninja", genre: "Action", mechanic: "shadow" },
  { title: "Parkour Flip", genre: "Platformer", mechanic: "jump" },
  { title: "Helix Color", genre: "Arcade", mechanic: "orbit" },
  { title: "Bubble Classic", genre: "Puzzle", mechanic: "switch" },
  { title: "Jelly Run", genre: "Runner", mechanic: "runner" },
  { title: "Sweet Candy", genre: "Puzzle", mechanic: "tiles" },
  { title: "Knife Flip", genre: "Action", mechanic: "blade" },
  { title: "Chrome Sprint", genre: "Runner", mechanic: "runner" },
  { title: "Pixel War", genre: "Shooter", mechanic: "laser" },
  { title: "World Hardest", genre: "Arcade", mechanic: "grid" },
  { title: "Stack Tower", genre: "Arcade", mechanic: "stack" },
  { title: "Click Counter Frenzy", genre: "Arcade", mechanic: "tiles" },
  { title: "Whack A Mole Lite", genre: "Action", mechanic: "grid" },
  { title: "Reaction Time Tester", genre: "Arcade", mechanic: "runner" },
  { title: "RGB Color Guess", genre: "Puzzle", mechanic: "switch" },
  { title: "Simon Says", genre: "Puzzle", mechanic: "switch" },
  { title: "Drag Drop Sorter", genre: "Puzzle", mechanic: "tiles" },
  { title: "Stickman Archer", genre: "Shooter", mechanic: "laser" },
  { title: "Bomberman Classic", genre: "Action", mechanic: "grid" },
  { title: "Stacktris", genre: "Puzzle", mechanic: "stack" },
  { title: "Gobble Maze", genre: "Arcade", mechanic: "maze" },
  { title: "Crossy Road", genre: "Arcade", mechanic: "lane" },
  { title: "Snake IO", genre: "Arcade", mechanic: "grid" },
  { title: "Flipping Master", genre: "Arcade", mechanic: "jump" },
  { title: "Slide Down", genre: "Arcade", mechanic: "runner" },
  { title: "Ziggy Road", genre: "Runner", mechanic: "lane" },
  { title: "Tag Game", genre: "Action", mechanic: "grid" },
  { title: "Browser Quest", genre: "Adventure", mechanic: "grid" },
  { title: "Pac Maze", genre: "Arcade", mechanic: "maze" },
  { title: "Super Dash Clone", genre: "Platformer", mechanic: "jump" },
  { title: "Redball Roll", genre: "Platformer", mechanic: "jump" },
  { title: "Bullet Bros", genre: "Shooter", mechanic: "laser" },
  { title: "Run Run Duck", genre: "Runner", mechanic: "bird" },
  { title: "Level Devil", genre: "Platformer", mechanic: "jump" },
  { title: "Temple Boom", genre: "Shooter", mechanic: "laser" },
  { title: "Poor Bunny", genre: "Arcade", mechanic: "jump" },
  { title: "Mine Rusher", genre: "Runner", mechanic: "runner" },
  { title: "All Star Clash", genre: "Action", mechanic: "grid" },
  { title: "Bouncing Dot", genre: "Arcade", mechanic: "orbit" },
  { title: "Cut The Rope Magic", genre: "Puzzle", mechanic: "orbit" },
  { title: "Bubble Shooter Classic", genre: "Puzzle", mechanic: "switch" },
  { title: "Jelly Run 2048", genre: "Puzzle", mechanic: "tiles" },
  { title: "Rock Paper Scissors", genre: "Strategy", mechanic: "switch" },
  { title: "Endless Car Race", genre: "Racing", mechanic: "kart" },
  { title: "Mega Ramp Moto", genre: "Racing", mechanic: "kart" },
  { title: "Traffic Jam 3D", genre: "Racing", mechanic: "lane" },
  { title: "Scoring Champion", genre: "Sports", mechanic: "arc" },
  { title: "Slashville", genre: "Action", mechanic: "blade" },
  { title: "Stick Kombat", genre: "Action", mechanic: "shadow" },
  { title: "Marine Showdown", genre: "Shooter", mechanic: "laser" },
  { title: "Road Fighter", genre: "Racing", mechanic: "kart" },
  { title: "Bowling Strike", genre: "Sports", mechanic: "arc" },
  { title: "Star Arena", genre: "Action", mechanic: "laser" },
  { title: "Bouncemasters", genre: "Arcade", mechanic: "jump" },
  { title: "Cars Arena", genre: "Racing", mechanic: "kart" },
  { title: "Cat Survivors", genre: "Action", mechanic: "grid" },
  { title: "Witchcat", genre: "Adventure", mechanic: "jump" },
  { title: "Parkour School", genre: "Platformer", mechanic: "jump" },
  { title: "Cartoon Strike", genre: "Shooter", mechanic: "laser" },
  { title: "Bird Shooter", genre: "Shooter", mechanic: "laser" },
  { title: "Sniper Pulse", genre: "Shooter", mechanic: "laser" },
  { title: "Alien Battle", genre: "Shooter", mechanic: "laser" },
  { title: "Space Fighter", genre: "Shooter", mechanic: "laser" },
  { title: "Orbital Outpost", genre: "Shooter", mechanic: "orbit" },
  { title: "Planet War", genre: "Shooter", mechanic: "laser" },
  { title: "Obby Speed Maze", genre: "Platformer", mechanic: "maze" },
  { title: "Slice Master", genre: "Action", mechanic: "blade" },
  { title: "Fruit Merge", genre: "Puzzle", mechanic: "tiles" },
  { title: "Cooking Sprint", genre: "Casual", mechanic: "tiles" },
  { title: "Carrom Clash", genre: "Board", mechanic: "orbit" },
  { title: "Snake Ladder", genre: "Board", mechanic: "grid" },
  { title: "Wordlee", genre: "Word", mechanic: "tiles" },
  { title: "Math Quest", genre: "Quiz", mechanic: "tiles" },
  { title: "Harvest Honors", genre: "Puzzle", mechanic: "tiles" },
  { title: "Sugar Heroes", genre: "Puzzle", mechanic: "tiles" }
];

const requestedGameNames = [
  "Snake",
  "Pac-Man",
  "Flappy Bird",
  "Crossy Road",
  "Bubble Pop",
  "Slither.io",
  "Tank Trouble",
  "Super Mario Bros HTML5",
  "Subway Surfer New York",
  "All Star Clash",
  "Pixel Shooter Unblocked",
  "Fireboy and Watergirl",
  "Squid Game Greenlight Redlight",
  "Frozen Rush",
  "Isle of the Lost Rush",
  "Bouble",
  "Beat Rush",
  "Block Puzzle",
  "Brick Breaker",
  "Bubble Shooter",
  "Coin Factory",
  "Color Switch",
  "Dungeon Descent",
  "Fruit Catch",
  "Gravity Bird",
  "Hex Collapse",
  "Ice Slide",
  "Math Dash",
  "Maze Runner",
  "Memory Cards",
  "Merge Mania",
  "Mine Field",
  "Orbit Defense",
  "Pixel Runner",
  "Snake Arena",
  "Solitaire Tower",
  "Space Dodge",
  "The Last Floor",
  "Tower Defense",
  "Whack A Mole",
  "Wire Connect",
  "Word Fall",
  "Geometry Dash",
  "Temple Run",
  "Sonic Dash",
  "Slope",
  "Paper.io",
  "Fruit Ninja",
  "Chrome Dino T-Rex",
  "Bottle Flip",
  "Zuma",
  "Geometry Dash Absolute Zero",
  "Redball 4",
  "Level Devil 2",
  "Temple of Boom",
  "Moss Moss",
  "Flappy Bird Clone",
  "Space Invaders Clone",
  "Super Mario Clone",
  "Pac-Man Clone",
  "Coil",
  "Color Quest",
  "Super Archer Catkeeper",
  "Escalator Rush 3D",
  "Body Race",
  "Vortella Dress Up",
  "Sprunki Phase 3",
  "Phase 6",
  "Lion Soldier Vengeance",
  "Stick Kombat 2D",
  "Slashville 3D",
  "Real Pool 3D",
  "Lava Run",
  "Orbital Strike",
  "Neon Blaster",
  "Pixel Dodge",
  "Sky Climb",
  "Turbo Tunnel",
  "Void Jump",
  "Wave Rider",
  "Xeno Attack",
  "Zombie Escape",
  "Apex Runner",
  "Blaze Jump",
  "Cyclone Spin",
  "Eclipse Run",
  "Fire Dash",
  "Galaxy Hopper",
  "Hyper Slide",
  "Infinity Loop",
  "Jungle Trek",
  "Kinetic Dash",
  "Luminous Trail",
  "Meteor Storm",
  "Nova Climb",
  "Omega Run",
  "Phantom Dash",
  "Quantum Leap",
  "Raptor Run",
  "Thunder Roll",
  "Ultra Slide",
  "Velocity X",
  "Wild Chase",
  "Xenon Rush",
  "Yoyo Jump",
  "Zen Runner",
  "Arcade Fury",
  "Blast Off",
  "Cosmic Dodge",
  "Dark Runner",
  "Energy Surge",
  "Fast Lane",
  "Glow Rider",
  "High Jump",
  "Ignite Run",
  "Jet Stream",
  "Knight Run",
  "Laser Dash",
  "Magma Jump",
  "Ninja Slide",
  "Outbreak Run",
  "Power Surge",
  "Rocket Jump",
  "Storm Rider",
  "Turbo Dash",
  "Urban Runner",
  "Vortex Jump",
  "2048",
  "Sudoku",
  "Tetris",
  "Cut the Rope",
  "Mahjong",
  "Solitaire",
  "Candy Crush Clone",
  "Blocky Blast Puzzle",
  "Train Loop",
  "Color Ball Run 2048",
  "Count Masters",
  "City Baby Agent",
  "Growing Fish",
  "Pixel Art Color by Numbers",
  "Google Feud",
  "Who Dies Last",
  "Minesweeper for Git Commits",
  "Save the World from Demons",
  "Rock Paper Scissors",
  "15 Tile Puzzle",
  "Skyline Architect",
  "Maze Game",
  "Memory Matching Game",
  "CodeQuest",
  "Wednesday Addams Merge Drop",
  "Italian Brainrot Animals Merge Puzzle",
  "Run Number Merge",
  "PRISM",
  "Rhythm Match",
  "Words of Wonder",
  "Quiz",
  "Wordle",
  "Skydom",
  "Sudoku 4 Difficulty Levels",
  "Mahjong Solitaire",
  "Chess AI",
  "Ludo",
  "Carrom"
];

const catalogThemes = buildCatalogThemes();

async function main() {
  await fs.mkdir(gamesRoot, { recursive: true });

  const passwordHash = await hashPassword("password123");
  const primaryCreator = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {
      username: "zeel_creator",
      avatar: avatarData("zeel_creator", "ZC"),
      bio: "Building tiny games for the ZEEL feed."
    },
    create: {
      username: "zeel_creator",
      email: "test@test.com",
      passwordHash,
      avatar: avatarData("zeel_creator", "ZC"),
      bio: "Building tiny games for the ZEEL feed."
    }
  });

  await prisma.user.upsert({
    where: { email: "zeel@test.com" },
    update: {
      username: "zeel",
      avatar: avatarData("zeel", "ZE"),
      bio: "Curating instant-play games for ZEEL."
    },
    create: {
      username: "zeel",
      email: "zeel@test.com",
      passwordHash,
      avatar: avatarData("zeel", "ZE"),
      bio: "Curating instant-play games for ZEEL."
    }
  });

  for (const badge of [
    { code: "first-game", name: "First Game", description: "Uploaded the first game." },
    { code: "popular", name: "Popular", description: "Reached 100 plays on a game." },
    { code: "streak-master", name: "Streak Master", description: "Built a 7 day login streak." }
  ]) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: { name: badge.name, description: badge.description },
      create: badge
    });
  }

  const creators = [primaryCreator];
  for (let index = 1; index <= 24; index += 1) {
    const username = `arcade_maker_${String(index).padStart(2, "0")}`;
    const creator = await prisma.user.upsert({
      where: { email: `${username}@zeel.test` },
      update: {
        username,
        avatar: avatarData(username, `A${String(index).padStart(2, "0")}`),
        bio: "Publishing quick-play arcade games on ZEEL."
      },
      create: {
        username,
        email: `${username}@zeel.test`,
        passwordHash,
        avatar: avatarData(username, `A${String(index).padStart(2, "0")}`),
        bio: "Publishing quick-play arcade games on ZEEL."
      }
    });
    creators.push(creator);
  }

  await prisma.collection.upsert({
    where: { userId_name: { userId: primaryCreator.id, name: "Default" } },
    update: {},
    create: { userId: primaryCreator.id, name: "Default" }
  });

  await prisma.game.updateMany({
    where: { uuid: { startsWith: "sample-game-" } },
    data: { isActive: false }
  });

  const realGames = [
    { uuid: "zeel-real-01", title: "Snake Classic", genre: "Arcade", description: "Guide the neon snake, eat pellets, and avoid your own tail in this swipe-controlled classic." },
    { uuid: "zeel-real-02", title: "2048 Merge", genre: "Puzzle", description: "Swipe to merge matching tiles and reach the legendary 2048 tile." },
    { uuid: "zeel-real-03", title: "Flappy Wing", genre: "Arcade", description: "Tap to flap through neon pipes without crashing in this addictive one-touch flyer." },
    { uuid: "zeel-real-04", title: "Fruit Slice", genre: "Action", description: "Swipe to slice flying fruit and avoid the bombs in this fast paced ninja slicer." },
    { uuid: "zeel-real-05", title: "Candy Match", genre: "Puzzle", description: "Tap two candies to swap and match three or more in this colorful match-3 puzzle." },
    { uuid: "zeel-real-06", title: "Metro Surfer", genre: "Runner", description: "Dodge oncoming trains, collect coins, and dash down the subway lanes." },
    { uuid: "zeel-real-07", title: "Temple Escape", genre: "Runner", description: "Sprint through ancient ruins, leap over gaps, and grab glowing gems." },
    { uuid: "zeel-real-08", title: "Bubble Pop", genre: "Puzzle", description: "Aim and shoot bubbles to match three or more colors before they reach the bottom." },
    { uuid: "zeel-real-09", title: "Tower Stack", genre: "Arcade", description: "Time your taps to stack blocks perfectly and build the tallest tower." },
    { uuid: "zeel-real-10", title: "Solo Chess", genre: "Board", description: "Play a full game of chess against a simple AI opponent, tap to select and move pieces." },
    { uuid: "zeel-real-11", title: "Pixel Pong", genre: "Sports", description: "Classic paddle-and-ball action - rally against the CPU and don't let the ball get past you." },
    { uuid: "zeel-real-12", title: "Brick Smash", genre: "Arcade", description: "Bounce the ball to smash every brick on the board without letting it fall." },
    { uuid: "zeel-real-13", title: "Whack Attack", genre: "Action", description: "Quick reflexes needed - whack the targets as they pop up before time runs out." },
    { uuid: "zeel-real-14", title: "Memory Cards", genre: "Puzzle", description: "Flip the cards two at a time and remember where every matching pair is hiding." },
    { uuid: "zeel-real-15", title: "Mine Sweep", genre: "Puzzle", description: "Clear the board without detonating a hidden mine in this classic logic puzzle." },
    { uuid: "zeel-real-16", title: "Connect Four", genre: "Board", description: "Drop your discs and be the first to connect four in a row against the AI." },
    { uuid: "zeel-real-17", title: "Tic Tac Toe", genre: "Board", description: "The timeless 3x3 grid battle - outsmart the computer opponent." },
    { uuid: "zeel-real-18", title: "Simon Beats", genre: "Puzzle", description: "Watch the sequence of colors and beats, then repeat it back correctly." },
    { uuid: "zeel-real-19", title: "Maze Runner", genre: "Adventure", description: "Navigate the shifting maze corridors and find the exit before time runs out." },
    { uuid: "zeel-real-20", title: "Slide Puzzle", genre: "Puzzle", description: "Slide the numbered tiles into order to solve the classic 15-puzzle." },
    { uuid: "zeel-real-21", title: "Reaction Flash", genre: "Action", description: "Test your reflexes - tap the instant the light flashes green." },
    { uuid: "zeel-real-22", title: "RPS Duel", genre: "Action", description: "Rock, paper, scissors - best of streaks against a clever AI opponent." },
    { uuid: "zeel-real-23", title: "Air Hockey", genre: "Sports", description: "Slide your paddle to smash the puck past the CPU and score first." },
    { uuid: "zeel-real-24", title: "Hoop Shots", genre: "Sports", description: "Time your shot and sink as many hoops as you can before the clock runs out." },
    { uuid: "zeel-real-25", title: "Whack-a-Mole", genre: "Action", description: "Tap the moles as fast as you can and avoid the bombs before time runs out." },

    { uuid: "zeel-real-26", title: "Color Match", genre: "Puzzle", description: "Decide if the displayed word matches its text color before time runs out." },
    { uuid: "zeel-real-27", title: "Stack Tower", genre: "Arcade", description: "Time your taps to drop moving blocks and stack the tallest tower possible." },
    { uuid: "zeel-real-28", title: "Bubble Rise", genre: "Arcade", description: "Pop the rising bubbles for points while dodging the marked bad ones." },
    { uuid: "zeel-real-29", title: "Word Scramble", genre: "Word", description: "Tap scrambled letters in order to spell out the hidden word each round." },
    { uuid: "zeel-real-30", title: "Archery Range", genre: "Sports", description: "Swipe up to launch arrows at the moving target and rack up bullseyes." },
    { uuid: "zeel-real-31", title: "Fruit Slice", genre: "Action", description: "Swipe to slice falling fruit and avoid the bombs before you run out of lives." },
    { uuid: "zeel-real-32", title: "Memory Match", genre: "Puzzle", description: "Flip cards two at a time to find every matching pair on the board." },
    { uuid: "zeel-real-33", title: "Balloon Pop", genre: "Arcade", description: "Tap rising balloons before they float away and escape past the top." },
    { uuid: "zeel-real-34", title: "Math Blitz", genre: "Quiz", description: "Solve quick arithmetic problems and pick the right answer before the timer ends." },
    { uuid: "zeel-real-35", title: "Dodge Blocks", genre: "Arcade", description: "Drag your ball left and right to dodge the falling blocks as long as you can." },

    { uuid: "zeel-real-36", title: "Rune Runner", genre: "Runner", description: "Sprint down a mystical rune path, jump gaps, and collect glowing scrolls." },
    { uuid: "zeel-real-37", title: "Word Ladder", genre: "Word", description: "Tap letters to spell increasingly longer words before the timer runs out." },
    { uuid: "zeel-real-38", title: "Neon Pinball", genre: "Arcade", description: "Flip the paddles to keep the ball alive and rack up bumper points." },
    { uuid: "zeel-real-39", title: "Gem Miner", genre: "Puzzle", description: "Dig through layers of rock tapping to collect gems and avoid bombs." },
    { uuid: "zeel-real-40", title: "Sky Jumper", genre: "Arcade", description: "Bounce upward from platform to platform without falling off screen." },
    { uuid: "zeel-real-41", title: "Neon Snake Arena", genre: "Arcade", description: "Grow your glowing trail while dodging walls and rival snakes." },
    { uuid: "zeel-real-42", title: "Puzzle Slide", genre: "Puzzle", description: "Slide colorful tiles to match the target pattern shown at the top." },
    { uuid: "zeel-real-43", title: "Star Catcher", genre: "Arcade", description: "Move your basket to catch falling stars while avoiding meteors." },
    { uuid: "zeel-real-44", title: "Lights Out", genre: "Puzzle", description: "Tap cells to toggle neighboring lights and clear the entire board." },
    { uuid: "zeel-real-45", title: "Darts Master", genre: "Sports", description: "Aim carefully and tap to throw darts at the bullseye for max points." },
    { uuid: "zeel-real-46", title: "Neon Territory", genre: "Strategy", description: "Swipe to claim grid territory while dodging roaming rival guards." },
    { uuid: "zeel-real-47", title: "Tower Bounce", genre: "Arcade", description: "Rotate the spinning tower to guide your ball through each gap safely." },
    { uuid: "zeel-real-48", title: "Combo Fighters", genre: "Action", description: "Punch and move to knock out your rival before they knock out you." },
    { uuid: "zeel-real-49", title: "Brawl Arena", genre: "Shooter", description: "Drag to dodge and tap to shoot down enemies circling the arena." },
    { uuid: "zeel-real-50", title: "Traffic Weave", genre: "Racing", description: "Swipe between lanes to weave through endless oncoming traffic." },
    { uuid: "zeel-real-51", title: "Zombie Highway", genre: "Racing", description: "Smash through zombies and dodge crates while racing down the highway." },
    { uuid: "zeel-real-52", title: "Police Pursuit", genre: "Racing", description: "Swipe to dodge cops and obstacles while your heat meter climbs." },
    { uuid: "zeel-real-53", title: "Tank Command", genre: "Strategy", description: "Place tanks along the path to defend your base from endless waves." }
  ];



  for (let i = 0; i < realGames.length; i += 1) {
    const rg = realGames[i];
    const folder = path.join(gamesRoot, rg.uuid);
    await fs.mkdir(folder, { recursive: true });
    await prisma.game.upsert({
      where: { uuid: rg.uuid },
      update: {
        title: rg.title,
        description: rg.description,
        genre: rg.genre,
        folderPath: folder,
        fileSizeMB: 0.06,
        playCount: 5000000 - i * 1000,
        hotnessScore: 99000000 - i * 1000,
        authorId: primaryCreator.id,
        isActive: true
      },
      create: {
        uuid: rg.uuid,
        title: rg.title,
        description: rg.description,
        genre: rg.genre,
        folderPath: folder,
        thumbnailPath: null,
        fileSizeMB: 0.06,
        playCount: 5000000 - i * 1000,
        hotnessScore: 99000000 - i * 1000,
        authorId: primaryCreator.id
      }
    });
  }

  for (let index = 1; index <= 10000; index += 1) {

    const uuid = `zeel-game-${String(index).padStart(4, "0")}`;
    const folder = path.join(gamesRoot, uuid);
    const theme = catalogThemes[(index - 1) % catalogThemes.length];
    const title = theme.title;
    const genre = theme.genre;
    const mechanic = theme.mechanic;
    const hue = 318 - ((index * 17) % 74);
    const accent = index % 4 === 0 ? "#ffffff" : "#F50575";
    const author = creators[((index * 17) + Math.floor(index / 20)) % creators.length];
    const qualityRank = Math.max(1, 10001 - index);
    const seededPlayCount = 100000 + qualityRank * 137;
    const seededHotness = 200000 + qualityRank;

    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(path.join(folder, "index.html"), sampleGameHtml({ index, title, hue, accent, mechanic }), "utf8");
    await prisma.game.upsert({
      where: { uuid },
      update: {
        title,
        description: `${author.username} built this touch-first ${genre.toLowerCase()} game for quick ZEEL sessions.`,
        genre,
        folderPath: folder,
        fileSizeMB: 0.05,
        playCount: seededPlayCount,
        hotnessScore: seededHotness,
        authorId: author.id,
        isActive: true
      },
      create: {
        uuid,
        title,
        description: `${author.username} built this touch-first ${genre.toLowerCase()} game for quick ZEEL sessions.`,
        genre,
        folderPath: folder,
        thumbnailPath: null,
        fileSizeMB: 0.05,
        playCount: seededPlayCount,
        hotnessScore: seededHotness,
        authorId: author.id
      }
    });
  }
}

function sampleGameHtml(options: { index: number; title: string; hue: number; accent: string; mechanic: string }) {
  return distinctGameHtml(options);
  const speed = (2.1 + (options.index % 10) * 0.16).toFixed(2);
  const palette = [
    ["#09090B", "#F50575", "#ffffff"],
    ["#070B12", "#2DE2E6", "#F50575"],
    ["#10080E", "#F50575", "#FFD166"],
    ["#07100D", "#06D6A0", "#ffffff"],
    ["#0D0A16", "#9B5CFF", "#F50575"],
    ["#111111", "#FFB703", "#ffffff"]
  ][options.index % 6];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(options.title)}</title>
  <style>
    :root { color-scheme: dark; --brand: #F50575; --ink: #ffffff; --panel: rgba(8,8,12,.72); }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #09090B; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; user-select: none; }
    canvas { display: block; width: 100vw; height: 100vh; touch-action: none; background: #09090B; }
    .hud { position: fixed; left: 28px; top: max(344px, env(safe-area-inset-top)); z-index: 3; display: none; justify-content: flex-start; pointer-events: none; color: var(--ink); }
    .pill { min-width: 76px; border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: var(--panel); padding: 9px 12px; font-size: 12px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; text-align: center; }
  </style>
</head>
<body>
  <canvas id="game"></canvas>
  <div class="hud" id="hud"><div class="pill">Score <span id="score">0</span></div></div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d', { alpha: false });
    const hud = document.getElementById('hud');
    const scoreEl = document.getElementById('score');
    let w = 0, h = 0, dpr = 1, running = false, points = 0, muted = true, tick = 0;
    const mode = '${options.mechanic}';
    const bg = '${palette[0]}';
    const accent = '${palette[1]}';
    const alt = '${palette[2]}';
    const speed = ${speed};
    const player = { lane: 1, x: 0, y: 0, targetX: 0, r: 24, jump: 0 };
    const obstacles = Array.from({ length: 7 }, (_, i) => ({ lane: i % 3, y: -i * 170, size: 34 + (i % 3) * 10, type: i % 4 }));

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(innerWidth * dpr);
      h = Math.floor(innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      player.r = 23 * dpr;
      player.y = h * .70;
      setLane(player.lane, false);
      draw();
    }

    function start() {
      if (running) return;
      hud.style.display = 'flex';
      running = true;
      raf = requestAnimationFrame(loop);
    }

    function roadWidthAt(y) {
      const t = Math.max(0, Math.min(1, y / h));
      const base = mode === 'tunnel' ? .10 : mode === 'kart' ? .26 : mode === 'maze' ? .22 : .18;
      const spread = mode === 'tunnel' ? .58 : mode === 'kart' ? .68 : mode === 'lane' ? .76 : .72;
      return w * (base + t * spread);
    }

    function laneX(lane, y = player.y) {
      const road = roadWidthAt(y);
      const left = w / 2 - road / 2;
      return left + (road / 4) * (lane + 1);
    }

    function setLane(lane, reward = true) {
      player.lane = Math.max(0, Math.min(2, lane));
      player.targetX = laneX(player.lane);
      if (reward) score(5);
    }

    function score(value) {
      points += value;
      scoreEl.textContent = points;
    }

    function jump() {
      player.jump = 1;
      score(10);
      if (!muted && 'vibrate' in navigator) navigator.vibrate(8);
    }

    function inputPoint(clientX, kind) {
      const x = clientX * dpr;
      if (kind === 'pointermove') {
        player.targetX = Math.max(player.r, Math.min(w - player.r, x));
        player.lane = player.targetX < w * .38 ? 0 : player.targetX > w * .62 ? 2 : 1;
        return;
      }
      if (kind === 'pointerdown' || kind === 'touchstart') {
        setLane(x < w * .38 ? 0 : x > w * .62 ? 2 : player.lane);
        jump();
      }
    }

    function input(event) {
      const point = event.touches ? event.touches[0] : event;
      inputPoint(point.clientX, event.type);
    }

    function lockScroll() { window.parent.postMessage({ type: 'LOCK_SCROLL' }, '*'); }
    function unlockScroll() { window.parent.postMessage({ type: 'UNLOCK_SCROLL' }, '*'); }

    function drawVectorMark(x, y, size, color, type) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      if (type === 0) {
        ctx.rect(-size * .7, -size * .7, size * 1.4, size * 1.4);
      } else if (type === 1) {
        ctx.arc(0, 0, size, 0, Math.PI * 2);
      } else if (type === 2) {
        ctx.moveTo(0, -size);
        ctx.lineTo(size * .86, size * .55);
        ctx.lineTo(-size * .86, size * .55);
        ctx.closePath();
      } else if (type === 3) {
        ctx.moveTo(0, -size);
        ctx.lineTo(size, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size, 0);
        ctx.closePath();
      } else {
        for (let i = 0; i < 8; i += 1) {
          const r = i % 2 ? size * .42 : size;
          const a = -Math.PI / 2 + i * Math.PI / 4;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
      ctx.fill();
      ctx.restore();
    }

    function playerShape() {
      const lift = Math.sin(player.jump * Math.PI) * 72 * dpr;
      const y = player.y - lift;
      ctx.save();
      ctx.translate(player.x, y);
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 26 * dpr;
      ctx.beginPath();
      if (mode === 'rocket' || mode === 'bird') {
        ctx.moveTo(player.r * 1.15, 0);
        ctx.lineTo(-player.r * .75, -player.r * .72);
        ctx.lineTo(-player.r * .34, 0);
        ctx.lineTo(-player.r * .75, player.r * .72);
        ctx.closePath();
      } else if (mode === 'kart') {
        ctx.roundRect(-player.r * 1.15, -player.r * .62, player.r * 2.3, player.r * 1.24, 10 * dpr);
      } else if (mode === 'blade' || mode === 'shadow') {
        ctx.moveTo(0, -player.r * 1.1);
        ctx.lineTo(player.r * .95, 0);
        ctx.lineTo(0, player.r * 1.1);
        ctx.lineTo(-player.r * .95, 0);
        ctx.closePath();
      } else if (mode === 'stack' || mode === 'tiles' || mode === 'breaker') {
        ctx.rect(player.r * -1, player.r * -1, player.r * 2, player.r * 2);
      } else {
        ctx.arc(0, 0, player.r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.beginPath();
      ctx.arc(-player.r * .28, -player.r * .28, player.r * .2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      if (mode === 'tunnel' || mode === 'nova') {
        ctx.strokeStyle = 'rgba(255,255,255,.06)';
        ctx.lineWidth = 1 * dpr;
        for (let i = 0; i < 8; i += 1) {
          const radius = ((tick * speed * .4 + i * 92) % 720) * dpr;
          ctx.beginPath();
          ctx.arc(w / 2, h * .42, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      const topY = 135 * dpr;
      const bottomY = h;
      const roadTop = roadWidthAt(topY);
      const roadBottom = roadWidthAt(bottomY);
      ctx.fillStyle = 'rgba(255,255,255,.025)';
      ctx.beginPath();
      ctx.moveTo(w / 2 - roadTop / 2, topY);
      ctx.lineTo(w / 2 + roadTop / 2, topY);
      ctx.lineTo(w / 2 + roadBottom / 2, bottomY);
      ctx.lineTo(w / 2 - roadBottom / 2, bottomY);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 22 * dpr;
      ctx.shadowColor = accent;
      ctx.strokeStyle = accent;
      ctx.globalAlpha = .58;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(w / 2 - roadTop / 2, topY);
      ctx.lineTo(w / 2 - roadBottom / 2, bottomY);
      ctx.moveTo(w / 2 + roadTop / 2, topY);
      ctx.lineTo(w / 2 + roadBottom / 2, bottomY);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      ctx.strokeStyle = 'rgba(255,255,255,.09)';
      ctx.lineWidth = 2 * dpr;
      for (let divider = 1; divider < 4; divider += 1) {
        ctx.beginPath();
        ctx.moveTo(w / 2 - roadTop / 2 + (roadTop / 4) * divider, topY);
        ctx.lineTo(w / 2 - roadBottom / 2 + (roadBottom / 4) * divider, bottomY);
        ctx.stroke();
      }
      for (let i = 0; i < 9; i += 1) {
        const y = ((i * 140 * dpr + tick * speed * dpr) % (h + 160 * dpr)) - 80 * dpr;
        const t = Math.max(0, Math.min(1, y / h));
        const wave = mode === 'drift' || mode === 'arc' || mode === 'comet';
        const width = (wave ? 52 + Math.sin((tick + i) * .04) * 16 : mode === 'breaker' ? 92 : 40) * dpr * (.35 + t);
        ctx.fillStyle = i % 2 ? 'rgba(45,226,230,.22)' : 'rgba(245,5,117,.24)';
        ctx.fillRect(w / 2 - width / 2, y, width, 4 * dpr);
      }

      for (let i = 0; i < 14; i += 1) {
        const y = ((i * 93 * dpr + tick * speed * .7 * dpr) % (h + 120 * dpr)) - 60 * dpr;
        const side = i % 2 ? -1 : 1;
        const x = w / 2 + side * (roadWidthAt(y) * .62 + (i % 3) * 18 * dpr);
        const size = (8 + (i % 4) * 4) * dpr;
        ctx.shadowColor = i % 3 ? accent : alt;
        ctx.shadowBlur = 18 * dpr;
        drawVectorMark(x, y, size, i % 3 ? accent : alt, 2);
        ctx.shadowBlur = 0;
      }

      obstacles.forEach((item, i) => {
        const wave = mode === 'orbit' || mode === 'laser' || mode === 'comet';
        const x = laneX(item.lane, item.y) + (wave ? Math.sin((tick + i * 18) * .035) * 28 * dpr : 0);
        const color = i % 2 ? alt : accent;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20 * dpr;
        const type = mode === 'tiles' || mode === 'breaker' || mode === 'maze' ? 0
          : mode === 'switch' || mode === 'orbit' ? 1
          : mode === 'crystal' || mode === 'blade' ? 3
          : mode === 'laser' || mode === 'shadow' ? 4
          : item.type;
        drawVectorMark(x, item.y, item.size * dpr, color, type);
        ctx.shadowBlur = 0;
      });
      playerShape();
    }

    function loop() {
      tick += 1;
      player.x += (player.targetX - player.x) * .18;
      player.jump = Math.max(0, player.jump - .035);
      obstacles.forEach((item, i) => {
        item.y += (speed + i * .06) * dpr;
        if (item.y > h + 80 * dpr) {
          item.y = -80 * dpr;
          item.lane = Math.floor(Math.random() * 3);
          item.type = (item.type + 1) % 4;
        }
        const x = laneX(item.lane, item.y);
        const lifted = player.jump > .12;
        const dx = Math.abs(x - player.x), dy = Math.abs(item.y - player.y);
        if (!lifted && dx < 42 * dpr && dy < 46 * dpr) {
          item.y = -90 * dpr;
          score(Math.max(0, points) ? -Math.min(10, points) : 0);
        }
      });
      draw();
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', (event) => { lockScroll(); input(event); }, { passive: true });
    window.addEventListener('pointermove', input, { passive: true });
    window.addEventListener('pointerup', unlockScroll, { passive: true });
    window.addEventListener('pointercancel', unlockScroll, { passive: true });
    window.addEventListener('touchstart', (event) => { lockScroll(); input(event); }, { passive: true });
    window.addEventListener('touchmove', input, { passive: true });
    window.addEventListener('touchend', unlockScroll, { passive: true });
    window.addEventListener('message', (event) => {
      const data = event.data || {};
      if (data.type === 'START_GAME') start();
      if (data.type === 'globalMute') muted = Boolean(data.value);
      if (data.type === 'ZEEL_POINTER') inputPoint(Number(data.x || innerWidth / 2), data.kind || 'pointermove');
      if (data.type === 'ZEEL_CONTROL') {
        if (data.control === 'LEFT') setLane(player.lane - 1);
        if (data.control === 'RIGHT') setLane(player.lane + 1);
        if (data.control === 'JUMP' || data.control === 'BOOST') jump();
      }
    });
    resize();
  </script>
</body>
</html>`;
}

function distinctGameHtml(options: { index: number; title: string; hue: number; accent: string; mechanic: string }) {
  const family = gameFamily(options.mechanic);
  const palettes = [
    ["#07080D", "#F50575", "#00E5FF", "#FFB703"],
    ["#050B13", "#00E5FF", "#F50575", "#FFFFFF"],
    ["#10070F", "#F50575", "#A15CFF", "#FFB703"],
    ["#080B08", "#06D6A0", "#F50575", "#FFFFFF"],
    ["#09090B", "#FFB703", "#00E5FF", "#F50575"]
  ];
  const palette = palettes[options.index % palettes.length];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${escapeHtml(options.title)}</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: ${palette[0]}; font-family: Inter, Arial, sans-serif; user-select: none; }
    canvas { display: block; width: 100vw; height: 100vh; touch-action: none; background: ${palette[0]}; }
    .hud { position: fixed; left: 16px; top: max(116px, calc(env(safe-area-inset-top) + 96px)); z-index: 4; display: none; pointer-events: none; color: #fff; }
    .pill { min-width: 82px; border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: rgba(0,0,0,.58); padding: 9px 12px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; text-align: center; }
  </style>
</head>
<body>
  <canvas id="game"></canvas>
  <div class="hud" id="hud"><div class="pill">Score <span id="score">0</span></div></div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d', { alpha: false });
    const hud = document.getElementById('hud');
    const scoreEl = document.getElementById('score');
    const family = '${family}';
    const bg = '${palette[0]}';
    const accent = '${palette[1]}';
    const alt = '${palette[2]}';
    const gold = '${palette[3]}';
    let dpr = 1, w = 0, h = 0, running = false, tick = 0, points = 0, lives = 3, ended = false, muted = true, raf = 0, audioCtx = null, nextBeat = 0, userActive = false;
    const state = {
      lane: 1, targetLane: 1, jump: 0, x: 0, y: 0, vy: 0, angle: 0, color: 0,
      paddle: 0, ballX: 0, ballY: 0, ballVX: 4, ballVY: -5, blockX: 0, blockDir: 1,
      touchX: 0, touchY: 0, pulse: 0, invulnerable: 0, selected: -1, stack: [], obstacles: [], particles: [], matchGrid: [], cardGrid: []
    };

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const rawWidth = innerWidth || document.documentElement.clientWidth || canvas.getBoundingClientRect().width || 390;
      const rawHeight = innerHeight || document.documentElement.clientHeight || canvas.getBoundingClientRect().height || 844;
      w = Math.max(320, Math.floor(rawWidth * dpr));
      h = Math.max(560, Math.floor(rawHeight * dpr));
      canvas.width = w; canvas.height = h;
      reset();
      draw();
    }

    function reset() {
      lives = 5; ended = false; userActive = false; state.invulnerable = 160; points = 0; scoreEl.textContent = points;
      state.x = w * .5; state.y = h * .68; state.paddle = w * .5; state.ballX = w * .5; state.ballY = h * .62;
      state.ballVX = (3.4 + (${options.index} % 5) * .35) * dpr; state.ballVY = -5 * dpr;
      state.stack = [{ x: w * .5, y: h * .62, width: w * .52, color: accent }];
      state.blockX = w * .18; state.blockDir = 1;
      state.matchGrid = Array.from({ length: 42 }, function(_, i) { return (i + ${options.index}) % 5; });
      state.cardGrid = Array.from({ length: 16 }, function(_, i) { return { value: (i + ${options.index}) % 8, open: false }; });
      state.obstacles = Array.from({ length: family === 'breaker' ? 30 : 8 }, function(_, i) {
        return { lane: i % 3, x: (70 + (i % 6) * 48) * dpr, y: -i * 145 * dpr, size: (22 + (i % 3) * 8) * dpr, hit: false, color: i % 2 ? alt : accent };
      });
    }

    function start() {
      if (running) return;
      hud.style.display = 'flex';
      running = true;
      if (!muted) ensureAudio();
      raf = requestAnimationFrame(loop);
    }

    function add(value) {
      if (ended || !userActive) return;
      points = Math.max(0, points + value);
      scoreEl.textContent = points;
    }

    function damage() {
      if (ended || state.invulnerable > 0) return;
      lives -= 1;
      state.invulnerable = 80;
      burst(state.x || state.paddle || w * .5, state.y || h * .62, '#FFFFFF', 18);
      if (lives <= 0) ended = true;
    }

    function ensureAudio() {
      if (audioCtx || muted) return;
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) { audioCtx = null; }
    }

    function playBeat() {
      if (muted || ended || !audioCtx || tick < nextBeat) return;
      nextBeat = tick + 24;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 170 + (points % 7) * 36;
      gain.gain.value = .085;
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + .12);
      osc.stop(audioCtx.currentTime + .13);
    }

    function setMuted(value) {
      muted = Boolean(value);
      if (!muted) ensureAudio();
    }

    function burst(x, y, color, count) {
      state.pulse = 1;
      state.touchX = x;
      state.touchY = y;
      for (let i = 0; i < count; i += 1) {
        const a = Math.random() * Math.PI * 2;
        const s = (1.8 + Math.random() * 4.2) * dpr;
        state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color });
      }
      if (state.particles.length > 90) state.particles.splice(0, state.particles.length - 90);
    }

    function control(name) {
      if (ended) { reset(); return; }
      userActive = true;
      if (name === 'LEFT') { state.targetLane = Math.max(0, state.targetLane - 1); state.paddle -= 54 * dpr; state.angle -= .24; state.color = (state.color + 2) % 3; add(2); }
      if (name === 'RIGHT') { state.targetLane = Math.min(2, state.targetLane + 1); state.paddle += 54 * dpr; state.angle += .24; state.color = (state.color + 1) % 3; add(2); }
      if (name === 'JUMP' || name === 'BOOST') {
        state.jump = 1; state.vy = -8 * dpr; state.color = (state.color + 1) % 3; dropBlock(); add(10);
        burst(state.paddle || state.x || w * .5, state.y || h * .62, accent, 14);
        if (!muted && 'vibrate' in navigator) navigator.vibrate(8);
      }
    }

    function pointer(x, y, kind) {
      if (ended) { reset(); return; }
      x *= dpr; y *= dpr;
      if (kind !== 'pointermove') userActive = true;
      state.touchX = x; state.touchY = y; state.pulse = Math.max(state.pulse, .65);
      state.paddle = x;
      if (family === 'flappy') { if (kind !== 'pointermove') control('JUMP'); return; }
      if (family === 'orbit') { state.angle = Math.atan2(y - h * .48, x - w * .5); if (kind !== 'pointermove') add(4); return; }
      if (family === 'switch') { if (kind !== 'pointermove') control('JUMP'); return; }
      if (family === 'stack') { if (kind !== 'pointermove') control('JUMP'); return; }
      if (family === 'match') { if (kind !== 'pointermove') { state.selected = hitGridCell(x, y, 6, 7, h*.18, h*.62); add(18); burst(x, y, accent, 12); } return; }
      if (family === 'cards') { if (kind !== 'pointermove') { state.selected = hitGridCell(x, y, 4, 4, h*.22, h*.48); const card = state.cardGrid[state.selected]; if (card) card.open = true; add(14); burst(x, y, alt, 10); } return; }
      if (family === 'bike') { if (kind !== 'pointermove') control('JUMP'); return; }
      if (family === 'lane') { state.targetLane = Math.max(0, Math.min(5, Math.floor((x / w) * 6))); if (kind !== 'pointermove') add(3); return; }
      state.targetLane = x < w * .38 ? 0 : x > w * .62 ? 2 : 1;
      if (kind !== 'pointermove') add(family === 'breaker' ? 4 : 2);
      if (kind !== 'pointermove') burst(x, y, accent, 8);
    }

    function laneX(lane, y) {
      const t = Math.max(0, Math.min(1, y / h));
      const road = w * (.20 + t * .72);
      return w / 2 - road / 2 + road / 4 * (lane + 1);
    }

    function hitGridCell(x, y, cols, rows, top, height) {
      const left = 28 * dpr;
      const width = w - 56 * dpr;
      const cellW = width / cols;
      const cellH = height / rows;
      const col = Math.max(0, Math.min(cols - 1, Math.floor((x - left) / cellW)));
      const row = Math.max(0, Math.min(rows - 1, Math.floor((y - top) / cellH)));
      return row * cols + col;
    }

    function clear() {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 60; i += 1) {
        ctx.fillStyle = i % 3 ? 'rgba(255,255,255,.09)' : accent;
        ctx.globalAlpha = i % 3 ? .25 : .42;
        ctx.fillRect((i * 71 % 390) / 390 * w, ((i * 47 + tick * (family === 'flappy' ? 2 : .5)) % 844) / 844 * h, 2 * dpr, 2 * dpr);
      }
      ctx.globalAlpha = 1;
    }

    function glow(color, blur) { ctx.shadowColor = color; ctx.shadowBlur = blur * dpr; }
    function noGlow() { ctx.shadowBlur = 0; }

    function drawTouchFeedback(targetX, targetY) {
      if (state.pulse <= 0) return;
      const alpha = state.pulse;
      glow(accent, 20);
      ctx.strokeStyle = 'rgba(245,5,117,' + (.35 * alpha) + ')';
      ctx.lineWidth = 3 * dpr;
      ctx.beginPath();
      ctx.arc(targetX, targetY, (34 + (1 - alpha) * 26) * dpr, 0, Math.PI * 2);
      ctx.stroke();
      noGlow();
    }

    function drawParticles() {
      for (let i = state.particles.length - 1; i >= 0; i -= 1) {
        const p = state.particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += .03 * dpr; p.life -= .035;
        if (p.life <= 0) { state.particles.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.life);
        glow(p.color, 14);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
      }
      ctx.globalAlpha = 1;
      state.pulse = Math.max(0, state.pulse - .045);
    }

    function drawRunner() {
      const topY = 132 * dpr, roadTop = w * .20, roadBottom = w * .92;
      ctx.fillStyle = 'rgba(255,255,255,.035)';
      ctx.beginPath(); ctx.moveTo(w/2-roadTop/2, topY); ctx.lineTo(w/2+roadTop/2, topY); ctx.lineTo(w/2+roadBottom/2, h); ctx.lineTo(w/2-roadBottom/2, h); ctx.closePath(); ctx.fill();
      glow(accent, 18); ctx.strokeStyle = accent; ctx.lineWidth = 2*dpr; ctx.beginPath(); ctx.moveTo(w/2-roadTop/2, topY); ctx.lineTo(w/2-roadBottom/2, h); ctx.moveTo(w/2+roadTop/2, topY); ctx.lineTo(w/2+roadBottom/2, h); ctx.stroke(); noGlow();
      state.x += (laneX(state.targetLane, state.y) - state.x) * .18; state.jump = Math.max(0, state.jump - .04);
      state.obstacles.forEach(function(o, i){ o.y += (3.2 + i*.05) * dpr; if (o.y > h + 80*dpr) { o.y = -120*dpr; o.lane = Math.floor(Math.random()*3); } const x = laneX(o.lane, o.y); glow(o.color, 16); ctx.fillStyle = o.color; ctx.fillRect(x-o.size/2, o.y-o.size/2, o.size, o.size); noGlow(); });
      const lift = Math.sin(state.jump*Math.PI)*70*dpr; glow(accent, 24); ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(state.x, state.y-lift, 24*dpr, 0, Math.PI*2); ctx.fill(); noGlow();
      state.obstacles.forEach(function(o){ const ox = laneX(o.lane, o.y); if (Math.abs(ox - state.x) < 34*dpr && Math.abs(o.y - (state.y-lift)) < 34*dpr) damage(); });
      drawTouchFeedback(state.x, state.y - lift);
    }

    function drawFlappy() {
      state.vy += .38 * dpr; state.y += state.vy; state.y = Math.max(120*dpr, Math.min(h-110*dpr, state.y));
      ctx.fillStyle = 'rgba(0,229,255,.08)'; ctx.fillRect(0, h*.72, w, h*.28);
      state.obstacles.forEach(function(o, i){ o.x = w - ((tick*3*dpr + i*185*dpr) % (w + 220*dpr)); const gap = (240 + (i%3)*32) * dpr; const top = (150 + (i*63)%210) * dpr; glow(i%2?alt:accent, 16); ctx.fillStyle = i%2?alt:accent; ctx.fillRect(o.x, 0, 42*dpr, top); ctx.fillRect(o.x, top+gap, 42*dpr, h); noGlow(); if(o.x < w*.32 + 24*dpr && o.x + 42*dpr > w*.32 - 24*dpr && (state.y < top || state.y > top + gap)) damage(); });
      if (state.y <= 122*dpr || state.y >= h-112*dpr) damage();
      glow(accent, 22); ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(w*.32+30*dpr, state.y); ctx.lineTo(w*.32-22*dpr, state.y-20*dpr); ctx.lineTo(w*.32-12*dpr, state.y); ctx.lineTo(w*.32-22*dpr, state.y+20*dpr); ctx.closePath(); ctx.fill(); noGlow();
      drawTouchFeedback(w*.32, state.y);
    }

    function drawBreaker() {
      state.paddle = Math.max(60*dpr, Math.min(w-60*dpr, state.paddle));
      ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(24*dpr, 132*dpr, w-48*dpr, h-250*dpr);
      state.obstacles.forEach(function(b, i){ if (b.hit) return; const col = i%6, row = Math.floor(i/6); const x = 42*dpr + col*((w-84*dpr)/6), y = 155*dpr + row*34*dpr; b.x=x; b.y=y; b.size=(w-110*dpr)/6; glow(b.color, 10); ctx.fillStyle = b.color; ctx.fillRect(x, y, b.size, 22*dpr); noGlow(); });
      state.ballX += state.ballVX; state.ballY += state.ballVY;
      if (state.ballX < 20*dpr || state.ballX > w-20*dpr) state.ballVX *= -1;
      if (state.ballY < 128*dpr) state.ballVY *= -1;
      if (Math.abs(state.ballY - (h-170*dpr)) < 16*dpr && Math.abs(state.ballX - state.paddle) < 64*dpr) { state.ballVY = -Math.abs(state.ballVY); add(8); }
      if (state.ballY > h-90*dpr) { damage(); state.ballX=w*.5; state.ballY=h*.58; state.ballVY=-5*dpr; }
      state.obstacles.forEach(function(b){ if(!b.hit && state.ballX>b.x && state.ballX<b.x+b.size && state.ballY>b.y && state.ballY<b.y+26*dpr){ b.hit=true; state.ballVY*=-1; add(15); } });
      glow(accent, 20); ctx.fillStyle=accent; ctx.fillRect(state.paddle-58*dpr,h-160*dpr,116*dpr,14*dpr); ctx.beginPath(); ctx.arc(state.ballX,state.ballY,12*dpr,0,Math.PI*2); ctx.fill(); noGlow();
      drawTouchFeedback(state.paddle, h-153*dpr);
    }

    function drawSwitch() {
      const colors=[accent,alt,gold]; const cx=w*.5, cy=h*.48; state.angle += .01;
      for(let r=0;r<3;r++){ ctx.strokeStyle=colors[r]; glow(colors[r],18); ctx.lineWidth=16*dpr; ctx.beginPath(); ctx.arc(cx,cy,(72+r*38)*dpr,state.angle+r*2,state.angle+r*2+Math.PI*1.35); ctx.stroke(); }
      noGlow(); glow(colors[state.color],22); ctx.fillStyle=colors[state.color]; ctx.beginPath(); ctx.arc(cx, h*.72, 24*dpr, 0, Math.PI*2); ctx.fill(); noGlow();
      drawTouchFeedback(cx, h*.72);
      state.obstacles.forEach(function(o,i){ o.y += (2.5+i*.05)*dpr; if(o.y>h+60*dpr){o.y=-80*dpr; o.x=(80+Math.random()*230)*dpr; o.color=colors[Math.floor(Math.random()*3)];} glow(o.color,16); ctx.fillStyle=o.color; ctx.beginPath(); ctx.arc(o.x||w*.5,o.y,16*dpr,0,Math.PI*2); ctx.fill(); noGlow(); if(Math.abs((o.x||w*.5)-cx)<36*dpr && Math.abs(o.y-h*.72)<36*dpr && o.color !== colors[state.color]) damage(); });
    }

    function dropBlock() {
      if (family !== 'stack') return;
      const last = state.stack[state.stack.length-1]; if (!last) return;
      const overlap = Math.max(0, Math.min(last.x + last.width/2, state.blockX + last.width/2) - Math.max(last.x - last.width/2, state.blockX - last.width/2));
      if (overlap > 14*dpr) { state.stack.push({ x: state.blockX, y: last.y - 32*dpr, width: overlap, color: state.stack.length % 2 ? alt : accent }); add(25); }
      else { damage(); state.stack = state.stack.slice(0,1); }
    }

    function drawStack() {
      state.blockX += state.blockDir * 4.5 * dpr; if(state.blockX < 60*dpr || state.blockX > w-60*dpr) state.blockDir *= -1;
      const last = state.stack[state.stack.length-1]; const y = last.y - 36*dpr; glow(accent,18); ctx.fillStyle=accent; ctx.fillRect(state.blockX-last.width/2,y,last.width,28*dpr); noGlow();
      state.stack.forEach(function(b){ glow(b.color,10); ctx.fillStyle=b.color; ctx.fillRect(b.x-b.width/2,b.y,b.width,28*dpr); noGlow(); });
      drawTouchFeedback(state.blockX, y + 14*dpr);
    }

    function drawOrbit() {
      const cx=w*.5, cy=h*.48, radius=Math.min(w,h)*.24; if (!userActive) state.angle += .018;
      glow(alt,22); ctx.strokeStyle=alt; ctx.lineWidth=4*dpr; ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.stroke(); noGlow();
      state.obstacles.forEach(function(o,i){ const a=tick*.018+i*.85; const r=radius+(i%2?42:-42)*dpr; const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; glow(i%2?accent:gold,16); ctx.fillStyle=i%2?accent:gold; ctx.beginPath(); ctx.arc(x,y,14*dpr,0,Math.PI*2); ctx.fill(); noGlow(); });
      const px=cx+Math.cos(state.angle)*radius, py=cy+Math.sin(state.angle)*radius; glow(accent,24); ctx.fillStyle=accent; ctx.beginPath(); ctx.arc(px,py,23*dpr,0,Math.PI*2); ctx.fill(); noGlow();
      state.obstacles.forEach(function(o,i){ const a=tick*.018+i*.85; const r=radius+(i%2?42:-42)*dpr; const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; if(Math.hypot(x-px,y-py)<32*dpr) damage(); });
      if (userActive && tick % 45 === 0) add(5);
      drawTouchFeedback(px, py);
    }

    function drawTilesGame() {
      ctx.fillStyle = 'rgba(245,5,117,.07)'; ctx.fillRect(22*dpr, 128*dpr, w-44*dpr, h-245*dpr);
      const cols = 4, rows = 8, gap = 8*dpr, tileW = (w - 86*dpr) / cols, top = 150*dpr;
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const active = c === Math.floor((state.paddle / w) * cols) || ((r*cols+c+tick/32+${options.index})|0)%7 === 0;
          const x = 32*dpr + c*tileW, y = top + r*((h-330*dpr)/rows);
          ctx.fillStyle = active ? (active === 1 ? alt : accent) : 'rgba(255,255,255,.08)';
          glow(active ? (active === 1 ? alt : accent) : '#FFFFFF', active ? 14 : 0);
          ctx.fillRect(x, y, tileW-gap, Math.max(28*dpr, (h-390*dpr)/rows));
          noGlow();
        }
      }
      const sx = Math.max(40*dpr, Math.min(w-40*dpr, state.paddle || w*.5));
      glow(gold,18); ctx.fillStyle=gold; ctx.fillRect(sx-72*dpr,h-168*dpr,144*dpr,18*dpr); noGlow();
      drawTouchFeedback(sx, h-180*dpr);
    }

    function drawMatchGame() {
      const cols = 6, rows = 7, top = h*.17, left = 28*dpr, width = w - 56*dpr, cell = width / cols, gap = 7*dpr;
      const colors = [accent, alt, gold, '#FFFFFF', '#7C5CFF'];
      ctx.fillStyle='rgba(255,255,255,.045)'; ctx.fillRect(left-10*dpr, top-10*dpr, width+20*dpr, cell*rows+20*dpr);
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const i=r*cols+c, x=left+c*cell, y=top+r*cell, color=colors[state.matchGrid[i] % colors.length];
          const selected = i === state.selected;
          glow(color, selected ? 24 : 10);
          ctx.fillStyle=color;
          ctx.beginPath(); ctx.roundRect(x+gap, y+gap, cell-gap*2, cell-gap*2, 12*dpr); ctx.fill();
          noGlow();
          if(selected && userActive && tick % 18 === 0){ state.matchGrid[i]=(state.matchGrid[i]+1)%colors.length; }
        }
      }
      drawTouchFeedback(state.touchX || w*.5, state.touchY || h*.45);
    }

    function drawCardsGame() {
      const cols=4, rows=4, top=h*.22, left=34*dpr, width=w-68*dpr, cell=width/cols, gap=9*dpr;
      ctx.fillStyle='rgba(0,229,255,.045)'; ctx.fillRect(left-10*dpr, top-10*dpr, width+20*dpr, cell*rows+20*dpr);
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const i=r*cols+c, card=state.cardGrid[i], x=left+c*cell, y=top+r*cell;
          const color = card.open ? [accent, alt, gold, '#FFFFFF'][card.value % 4] : 'rgba(255,255,255,.10)';
          glow(card.open ? color : '#FFFFFF', card.open ? 16 : 2);
          ctx.fillStyle=color;
          ctx.beginPath(); ctx.roundRect(x+gap, y+gap, cell-gap*2, cell-gap*2, 10*dpr); ctx.fill();
          noGlow();
          if(card.open){ ctx.fillStyle='#05060A'; ctx.font='900 '+(18*dpr)+'px Arial'; ctx.textAlign='center'; ctx.fillText(String(card.value + 1), x+cell/2, y+cell*.58); }
        }
      }
      drawTouchFeedback(state.touchX || w*.5, state.touchY || h*.5);
    }

    function drawBikeGame() {
      const ground=h*.72;
      state.jump=Math.max(0,state.jump-.032);
      const lift=Math.sin(state.jump*Math.PI)*115*dpr;
      state.x += (Math.max(44*dpr, Math.min(w-44*dpr, state.paddle || w*.42)) - state.x) * .18;
      ctx.fillStyle='rgba(255,255,255,.035)'; ctx.fillRect(0, ground, w, h-ground);
      glow(accent,14); ctx.strokeStyle=accent; ctx.lineWidth=4*dpr; ctx.beginPath();
      ctx.moveTo(0,ground); for(let x=0;x<w;x+=50*dpr){ ctx.lineTo(x, ground - Math.sin((x+tick*5*dpr)*.01)*26*dpr); } ctx.stroke(); noGlow();
      state.obstacles.forEach(function(o,i){ o.x = w - ((tick*(3.8*dpr)+i*210*dpr)%(w+220*dpr)); const rampY=ground-18*dpr; glow(i%2?alt:gold,12); ctx.fillStyle=i%2?alt:gold; ctx.beginPath(); ctx.moveTo(o.x,rampY); ctx.lineTo(o.x+56*dpr,rampY); ctx.lineTo(o.x+56*dpr,rampY-40*dpr); ctx.closePath(); ctx.fill(); noGlow(); if(Math.abs(o.x-state.x)<46*dpr && lift<45*dpr) damage(); });
      const by=ground-42*dpr-lift;
      glow(accent,20); ctx.strokeStyle=accent; ctx.lineWidth=6*dpr; ctx.beginPath(); ctx.arc(state.x-18*dpr,by+22*dpr,15*dpr,0,Math.PI*2); ctx.arc(state.x+22*dpr,by+22*dpr,15*dpr,0,Math.PI*2); ctx.moveTo(state.x-18*dpr,by+22*dpr); ctx.lineTo(state.x+4*dpr,by); ctx.lineTo(state.x+22*dpr,by+22*dpr); ctx.moveTo(state.x+4*dpr,by); ctx.lineTo(state.x+18*dpr,by-20*dpr); ctx.stroke(); noGlow();
      drawTouchFeedback(state.x, by);
    }

    function drawGridGame() {
      const cell = Math.min(w, h) / 9;
      const left = w/2 - cell*3, top = h*.24;
      ctx.fillStyle='rgba(0,229,255,.05)'; ctx.fillRect(left-12*dpr, top-12*dpr, cell*6+24*dpr, cell*6+24*dpr);
      ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.lineWidth=1*dpr;
      for(let i=0;i<=6;i++){ ctx.beginPath(); ctx.moveTo(left+i*cell,top); ctx.lineTo(left+i*cell,top+cell*6); ctx.moveTo(left,top+i*cell); ctx.lineTo(left+cell*6,top+i*cell); ctx.stroke(); }
      const gx = Math.max(0, Math.min(5, Math.floor((state.paddle/w)*6)));
      const gy = 4 + Math.round(Math.sin(tick*.03));
      const px = left + gx*cell + cell/2, py = top + gy*cell + cell/2;
      glow(accent,18); ctx.fillStyle=accent; ctx.beginPath(); ctx.arc(px,py,cell*.28,0,Math.PI*2); ctx.fill(); noGlow();
      state.obstacles.forEach(function(o,i){ const ox=left+((i+tick/45)|0)%6*cell+cell/2, oy=top+(i%5)*cell+cell/2; glow(i%2?alt:gold,12); ctx.fillStyle=i%2?alt:gold; ctx.fillRect(ox-cell*.22,oy-cell*.22,cell*.44,cell*.44); noGlow(); if(Math.abs(ox-px)<cell*.35&&Math.abs(oy-py)<cell*.35) damage(); });
      drawTouchFeedback(px,py);
    }

    function drawMazeGame() {
      const cell = Math.min(w, h) / 8.2;
      const left = w/2 - cell*3, top = h*.22;
      const pxCell = Math.max(0, Math.min(5, Math.floor((state.paddle / w) * 6)));
      const pyCell = Math.max(0, Math.min(5, Math.floor(((state.touchY || h*.55) - top) / cell)));
      ctx.fillStyle = 'rgba(255,255,255,.045)';
      ctx.fillRect(left - 14*dpr, top - 14*dpr, cell*6 + 28*dpr, cell*6 + 28*dpr);
      for (let y=0; y<6; y+=1) {
        for (let x=0; x<6; x+=1) {
          const wall = ((x*13 + y*7 + ${options.index}) % 5) === 0 && !(x === pxCell && y === pyCell);
          if (wall) {
            glow(alt, 10);
            ctx.fillStyle = 'rgba(0,229,255,.72)';
            ctx.fillRect(left+x*cell+6*dpr, top+y*cell+6*dpr, cell-12*dpr, cell-12*dpr);
            noGlow();
          }
        }
      }
      const exitX = left + cell*5.5, exitY = top + cell*.5;
      glow(gold, 18); ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(exitX, exitY, cell*.22, 0, Math.PI*2); ctx.fill(); noGlow();
      const px = left + pxCell*cell + cell/2, py = top + pyCell*cell + cell/2;
      glow(accent, 20); ctx.fillStyle = accent; ctx.fillRect(px-cell*.22, py-cell*.22, cell*.44, cell*.44); noGlow();
      if (Math.hypot(px-exitX, py-exitY) < cell*.5) { add(30); burst(exitX, exitY, gold, 16); }
      drawTouchFeedback(px, py);
    }

    function drawLaneGame() {
      const lanes = 6, laneH = (h*.58) / lanes, top = h*.20;
      state.y += ((top + (state.targetLane + .5) * laneH) - state.y) * .18;
      state.x = Math.max(36*dpr, Math.min(w-36*dpr, state.paddle || w*.28));
      for (let i=0; i<lanes; i+=1) {
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,229,255,.045)';
        ctx.fillRect(22*dpr, top+i*laneH, w-44*dpr, laneH-2*dpr);
        const dir = i % 2 ? -1 : 1;
        for (let c=0; c<3; c+=1) {
          const ox = (dir > 0 ? ((tick*2.8*dpr + c*w*.42 + i*31*dpr) % (w+120*dpr)) - 60*dpr : w - ((tick*2.8*dpr + c*w*.42 + i*31*dpr) % (w+120*dpr)));
          const oy = top+i*laneH+laneH*.5;
          glow(i%2?alt:gold, 11);
          ctx.fillStyle = i%2?alt:gold;
          ctx.fillRect(ox-32*dpr, oy-16*dpr, 64*dpr, 32*dpr);
          noGlow();
          if (Math.abs(ox-state.x)<44*dpr && Math.abs(oy-state.y)<30*dpr) damage();
        }
      }
      glow(accent, 20); ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(state.x, state.y, 23*dpr, 0, Math.PI*2); ctx.fill(); noGlow();
      drawTouchFeedback(state.x, state.y);
    }

    function drawSliceGame() {
      ctx.fillStyle='rgba(245,5,117,.045)'; ctx.fillRect(20*dpr, 126*dpr, w-40*dpr, h-230*dpr);
      state.obstacles.forEach(function(o,i){
        o.y += (2.7 + i*.06) * dpr;
        o.x = o.x || (50 + ((i*61) % Math.max(120, innerWidth-100))) * dpr;
        if(o.y > h + 60*dpr){ o.y = -70*dpr; o.x = (48 + Math.random()*(innerWidth-96))*dpr; o.hit=false; }
        const close = Math.hypot((state.touchX||-9999)-o.x, (state.touchY||-9999)-o.y) < 42*dpr;
        if (close && !o.hit && userActive) { o.hit = true; add(18); burst(o.x, o.y, i%2?alt:accent, 16); }
        if (o.hit) return;
        glow(i%2?alt:accent, 16);
        ctx.fillStyle = i%2?alt:accent;
        ctx.beginPath(); ctx.arc(o.x, o.y, (18+(i%3)*5)*dpr, 0, Math.PI*2); ctx.fill();
        noGlow();
      });
      glow(gold, 16); ctx.strokeStyle=gold; ctx.lineWidth=5*dpr; ctx.beginPath(); ctx.moveTo((state.touchX||w*.5)-55*dpr,(state.touchY||h*.55)+40*dpr); ctx.lineTo((state.touchX||w*.5)+55*dpr,(state.touchY||h*.55)-40*dpr); ctx.stroke(); noGlow();
      drawTouchFeedback(state.touchX || w*.5, state.touchY || h*.55);
    }

    function drawCombatGame() {
      const heroX = Math.max(42*dpr, Math.min(w-42*dpr, state.paddle || w*.5));
      const heroY = h*.74;
      ctx.fillStyle='rgba(255,255,255,.035)'; ctx.fillRect(20*dpr, 128*dpr, w-40*dpr, h-232*dpr);
      state.obstacles.forEach(function(o,i){
        o.y += (2.4 + i*.08) * dpr;
        o.x = o.x || (44 + ((i*71) % Math.max(120, innerWidth-88))) * dpr;
        if(o.y > h + 80*dpr){ o.y = -90*dpr; o.x = (44 + Math.random()*(innerWidth-88))*dpr; o.hit=false; }
        if (Math.abs(o.x-heroX)<54*dpr && Math.abs(o.y-heroY)<62*dpr) { o.hit=true; add(14); burst(o.x,o.y,accent,14); }
        if (!o.hit) {
          glow(i%2?alt:gold, 13); ctx.fillStyle=i%2?alt:gold; ctx.fillRect(o.x-20*dpr,o.y-20*dpr,40*dpr,40*dpr); noGlow();
        }
      });
      glow(accent, 22); ctx.fillStyle=accent; ctx.beginPath(); ctx.moveTo(heroX,heroY-34*dpr); ctx.lineTo(heroX-30*dpr,heroY+34*dpr); ctx.lineTo(heroX+30*dpr,heroY+34*dpr); ctx.closePath(); ctx.fill(); noGlow();
      glow(gold, 15); ctx.strokeStyle=gold; ctx.lineWidth=4*dpr; ctx.beginPath(); ctx.arc(heroX, heroY-18*dpr, 54*dpr, -0.35, Math.PI+.35); ctx.stroke(); noGlow();
      drawTouchFeedback(heroX, heroY);
    }

    function drawShooterGame() {
      const shipX = Math.max(38*dpr, Math.min(w-38*dpr, state.paddle || w*.5));
      ctx.fillStyle='rgba(255,255,255,.035)'; ctx.fillRect(24*dpr, 126*dpr, w-48*dpr, h-220*dpr);
      state.obstacles.forEach(function(o,i){ o.y += (2.2+i*.08)*dpr; if(o.y>h+60*dpr){o.y=-80*dpr; o.x=(40+Math.random()*(innerWidth-80))*dpr;} const ox=o.x||((i*53)%innerWidth)*dpr; glow(i%2?alt:accent,14); ctx.fillStyle=i%2?alt:accent; ctx.beginPath(); ctx.arc(ox,o.y,18*dpr,0,Math.PI*2); ctx.fill(); noGlow(); if(Math.abs(ox-shipX)<34*dpr&&Math.abs(o.y-h*.74)<38*dpr) damage(); });
      glow(gold,18); ctx.strokeStyle=gold; ctx.lineWidth=5*dpr; ctx.beginPath(); ctx.moveTo(shipX,h*.74); ctx.lineTo(shipX,h*.34); ctx.stroke(); noGlow();
      glow(accent,22); ctx.fillStyle=accent; ctx.beginPath(); ctx.moveTo(shipX,h*.78); ctx.lineTo(shipX-24*dpr,h*.84); ctx.lineTo(shipX+24*dpr,h*.84); ctx.closePath(); ctx.fill(); noGlow();
      drawTouchFeedback(shipX,h*.78);
    }

    function drawCarGame() {
      const roadTop = 130*dpr, roadBottom = w*.92, roadTopW = w*.28;
      ctx.fillStyle='rgba(255,255,255,.04)'; ctx.beginPath(); ctx.moveTo(w/2-roadTopW/2,roadTop); ctx.lineTo(w/2+roadTopW/2,roadTop); ctx.lineTo(w/2+roadBottom/2,h); ctx.lineTo(w/2-roadBottom/2,h); ctx.closePath(); ctx.fill();
      state.x += (laneX(state.targetLane,state.y)-state.x)*.2;
      state.obstacles.forEach(function(o,i){ o.y += (3.5+i*.05)*dpr; if(o.y>h+60*dpr){o.y=-80*dpr; o.lane=Math.floor(Math.random()*3);} const ox=laneX(o.lane,o.y); glow(i%2?alt:gold,12); ctx.fillStyle=i%2?alt:gold; ctx.fillRect(ox-22*dpr,o.y-34*dpr,44*dpr,68*dpr); noGlow(); if(Math.abs(ox-state.x)<42*dpr&&Math.abs(o.y-state.y)<58*dpr) damage(); });
      glow(accent,18); ctx.fillStyle=accent; ctx.fillRect(state.x-24*dpr,state.y-36*dpr,48*dpr,72*dpr); noGlow();
      drawTouchFeedback(state.x,state.y);
    }

    function drawSportsGame() {
      const targetX = w*.5 + Math.sin(tick*.025)*w*.25, targetY = h*.30;
      glow(gold,14); ctx.strokeStyle=gold; ctx.lineWidth=7*dpr; ctx.beginPath(); ctx.arc(targetX,targetY,42*dpr,0,Math.PI*2); ctx.stroke(); noGlow();
      const bx = state.paddle || w*.5, by = h*.72 - Math.abs(Math.sin(state.jump*Math.PI))*h*.33;
      glow(accent,22); ctx.fillStyle=accent; ctx.beginPath(); ctx.arc(bx,by,24*dpr,0,Math.PI*2); ctx.fill(); noGlow();
      if(state.jump>.2 && Math.hypot(bx-targetX,by-targetY)<54*dpr){ add(20); state.jump=0; burst(targetX,targetY,gold,18); }
      drawTouchFeedback(bx,by);
    }

    function drawDinoGame() {
      state.jump = Math.max(0,state.jump-.035);
      const lift = Math.sin(state.jump*Math.PI)*110*dpr;
      const ground = h*.74;
      ctx.strokeStyle=accent; ctx.lineWidth=3*dpr; ctx.beginPath(); ctx.moveTo(0,ground); ctx.lineTo(w,ground); ctx.stroke();
      state.obstacles.forEach(function(o,i){ o.x = w - ((tick*(3.2*dpr)+i*170*dpr)%(w+180*dpr)); glow(i%2?alt:gold,12); ctx.fillStyle=i%2?alt:gold; ctx.fillRect(o.x,ground-48*dpr,28*dpr,48*dpr); noGlow(); if(o.x<w*.32+24*dpr&&o.x+28*dpr>w*.32-24*dpr&&lift<45*dpr) damage(); });
      glow(accent,18); ctx.fillStyle=accent; ctx.fillRect(w*.32-24*dpr,ground-52*dpr-lift,48*dpr,52*dpr); noGlow();
      drawTouchFeedback(w*.32,ground-52*dpr-lift);
    }

    function drawGameHud() {
      ctx.fillStyle = 'rgba(0,0,0,.58)';
      ctx.fillRect(w - 112*dpr, 112*dpr, 88*dpr, 36*dpr);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 ' + (12*dpr) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('LIVES ' + lives, w - 68*dpr, 135*dpr);
      ctx.fillStyle = 'rgba(0,0,0,.52)';
      ctx.beginPath(); ctx.roundRect(w*.5-118*dpr, h*.82, 236*dpr, 30*dpr, 999*dpr); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.82)';
      ctx.font = '900 ' + (10*dpr) + 'px Arial';
      ctx.fillText(controlHint(), w*.5, h*.82 + 20*dpr);
      if (!ended) return;
      ctx.fillStyle = 'rgba(0,0,0,.72)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = accent;
      ctx.font = '900 ' + (36*dpr) + 'px Arial';
      ctx.fillText('GAME OVER', w/2, h*.43);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 ' + (16*dpr) + 'px Arial';
      ctx.fillText('Tap or press Space to restart', w/2, h*.50);
    }

    function controlHint() {
      if (family === 'orbit') return 'DRAG AROUND THE RING';
      if (family === 'tiles') return 'DRAG TO HIT TILES';
      if (family === 'match') return 'TAP CANDY BLOCKS';
      if (family === 'cards') return 'TAP CARDS TO FLIP';
      if (family === 'bike') return 'DRAG + TAP TO JUMP';
      if (family === 'shooter') return 'DRAG TO SHOOT';
      if (family === 'car') return 'DRAG TO STEER';
      if (family === 'flappy' || family === 'dino') return 'TAP TO JUMP';
      if (family === 'stack') return 'TAP TO DROP';
      return 'DRAG OR TAP TO PLAY';
    }

    function draw() {
      clear();
      if (family === 'flappy') drawFlappy();
      else if (family === 'breaker') drawBreaker();
      else if (family === 'tiles') drawTilesGame();
      else if (family === 'match') drawMatchGame();
      else if (family === 'cards') drawCardsGame();
      else if (family === 'bike') drawBikeGame();
      else if (family === 'maze') drawMazeGame();
      else if (family === 'grid') drawGridGame();
      else if (family === 'lane') drawLaneGame();
      else if (family === 'slice') drawSliceGame();
      else if (family === 'combat') drawCombatGame();
      else if (family === 'shooter') drawShooterGame();
      else if (family === 'car') drawCarGame();
      else if (family === 'sports') drawSportsGame();
      else if (family === 'dino') drawDinoGame();
      else if (family === 'switch') drawSwitch();
      else if (family === 'stack') drawStack();
      else if (family === 'orbit') drawOrbit();
      else drawRunner();
      drawParticles();
      if (state.invulnerable > 0) state.invulnerable -= 1;
      playBeat();
      drawGameHud();
    }

    function loop() { tick += 1; draw(); raf = requestAnimationFrame(loop); }
    addEventListener('resize', resize);
    addEventListener('pointerdown', function(e){ pointer(e.clientX, e.clientY, 'pointerdown'); });
    addEventListener('pointermove', function(e){ pointer(e.clientX, e.clientY, 'pointermove'); });
    addEventListener('touchstart', function(e){ const t=e.touches[0]; if(t) pointer(t.clientX,t.clientY,'touchstart'); }, { passive: true });
    addEventListener('touchmove', function(e){ const t=e.touches[0]; if(t) pointer(t.clientX,t.clientY,'pointermove'); }, { passive: true });
    addEventListener('message', function(event){
      const data = event.data || {};
      if (data.type === 'START_GAME') start();
      if (data.type === 'globalMute') setMuted(data.value);
      if (data.type === 'ZEEL_POINTER') pointer(Number(data.x || innerWidth/2), Number(data.y || innerHeight/2), data.kind || 'pointermove');
      if (data.type === 'ZEEL_CONTROL') control(data.control);
    });
    addEventListener('keydown', function(event){
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); control('LEFT'); }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); control('RIGHT'); }
      if (event.key === 'ArrowUp' || event.key === ' ' || event.key.toLowerCase() === 'w') { event.preventDefault(); control('JUMP'); }
    });
    resize();
  </script>
</body>
</html>`;
}

function gameFamily(mechanic: string) {
  if (["maze"].includes(mechanic)) return "maze";
  if (["grid"].includes(mechanic)) return "grid";
  if (["laser"].includes(mechanic)) return "shooter";
  if (["kart"].includes(mechanic)) return "car";
  if (["bike"].includes(mechanic)) return "bike";
  if (["arc"].includes(mechanic)) return "sports";
  if (["match"].includes(mechanic)) return "match";
  if (["cards"].includes(mechanic)) return "cards";
  if (["tiles"].includes(mechanic)) return "tiles";
  if (["jump"].includes(mechanic)) return "dino";
  if (["bird", "rocket", "comet"].includes(mechanic)) return "flappy";
  if (["breaker"].includes(mechanic)) return "breaker";
  if (["switch", "nova"].includes(mechanic)) return "switch";
  if (["blade"].includes(mechanic)) return "slice";
  if (["shadow"].includes(mechanic)) return "combat";
  if (["stack", "crystal"].includes(mechanic)) return "stack";
  if (["lane"].includes(mechanic)) return "lane";
  if (["orbit", "tunnel", "arc"].includes(mechanic)) return "orbit";
  return "runner";
}

function buildCatalogThemes() {
  const requested = uniqueCatalogNames([...popularThemes.map((theme) => theme.title), ...requestedGameNames]).map((title) => ({
    title,
    genre: inferGenre(title),
    mechanic: inferMechanic(title)
  }));
  const themed = uniqueThemeCatalog([...requested, ...generateProductionCatalogThemes()]).slice(0, 10000);
  const buckets = themed.reduce<Record<string, typeof themed>>((acc, theme) => {
    const family = `${theme.genre}:${gameFamily(theme.mechanic)}`;
    acc[family] = acc[family] ?? [];
    acc[family].push(theme);
    return acc;
  }, {});
  const familyOrder = Object.keys(buckets).sort();
  const balanced: typeof themed = [];
  let cursor = 0;
  while (balanced.length < 10000 && familyOrder.some((family) => buckets[family]?.[cursor])) {
    for (const family of familyOrder) {
      const item = buckets[family]?.[cursor];
      if (item) balanced.push(item);
      if (balanced.length >= 10000) break;
    }
    cursor += 1;
  }
  for (const theme of themed) {
    if (balanced.length >= 10000) break;
    if (!balanced.some((item) => item.title.toLowerCase() === theme.title.toLowerCase())) balanced.push(theme);
  }

  return balanced;
}

function uniqueThemeCatalog(themes: Array<{ title: string; genre: string; mechanic: string }>) {
  const seen = new Set<string>();
  return themes.filter((theme) => {
    const title = theme.title.replace(/\s+/g, " ").trim();
    const key = title.toLowerCase();
    if (!title || seen.has(key)) return false;
    seen.add(key);
    theme.title = title;
    return true;
  });
}

function generateProductionCatalogThemes() {
  const prefixes = [
    "Neon", "Cyber", "Pixel", "Turbo", "Galaxy", "Crystal", "Shadow", "Rocket", "Nitro", "Hyper",
    "Cosmic", "Metro", "Laser", "Quantum", "Nova", "Storm", "Apex", "Blaze", "Phantom", "Velocity",
    "Gravity", "Orbit", "Mystic", "Arcade", "Jungle", "Temple", "Sky", "Ocean", "Desert", "Arctic",
    "Dragon", "Robot", "Ninja", "Pirate", "Hero", "Monster", "Alien", "Zombie", "Wizard", "Knight",
    "Solar", "Lunar", "Prism", "Chrome", "Vector", "Ion", "Plasma", "Omega", "Rift", "Vortex"
  ];
  const worlds = [
    "Circuit", "Arena", "Zone", "Lab", "City", "Valley", "Tower", "Station", "Harbor", "Canyon",
    "Factory", "Temple", "Skyline", "Garden", "Tunnel", "Island", "Outpost", "Fortress", "Bridge", "Portal",
    "Reactor", "Market", "Dungeon", "Circuitry", "Galaxy", "Coast", "Peak", "Village", "Grid", "Vault"
  ];
  const modes = [
    "Rush", "Clash", "Quest", "Fever", "Sprint", "Mania", "Legends", "Classic", "Pulse", "Rivals",
    "Challenge", "League", "Storm", "Dash", "Surge", "Master", "Shift", "Breakout", "Trials", "Run"
  ];
  const blueprints = [
    { genre: "Action", mechanics: ["blade", "shadow", "grid", "laser"], roots: ["Slice", "Kombat", "Arena", "Strike", "Dodge", "Survivor", "Clash", "Raid"] },
    { genre: "Puzzle", mechanics: ["match", "tiles", "cards", "switch", "grid", "orbit"], roots: ["Candy", "Tiles", "Merge", "Match", "Cards", "Puzzle", "Loop", "Switch", "Blocks", "Maze"] },
    { genre: "Racing", mechanics: ["bike", "kart", "lane", "runner"], roots: ["Bike", "BMX", "Moto", "Kart", "Drift", "Racer", "Highway", "Traffic", "Rally", "Speedway"] },
    { genre: "Arcade", mechanics: ["breaker", "switch", "orbit", "stack"], roots: ["Pinball", "Breaker", "Bubble", "Orbit", "Stack", "Bounce", "Popper", "Hoop"] },
    { genre: "Runner", mechanics: ["runner", "lane", "jump", "tunnel"], roots: ["Runner", "Dash", "Sprint", "Surf", "Trail", "Rush", "Slope", "Parkour"] },
    { genre: "Shooter", mechanics: ["laser", "grid", "orbit"], roots: ["Shooter", "Blaster", "Invaders", "Tank", "Sniper", "Bullet", "Fighter", "Cannon"] },
    { genre: "Sports", mechanics: ["arc", "orbit"], roots: ["Basket", "Goal", "Tennis", "Pool", "Golf", "Penalty", "Dunk", "Bowling"] },
    { genre: "Strategy", mechanics: ["cards", "grid", "tiles", "maze"], roots: ["Cards", "Defense", "Chess", "Tactics", "Ludo", "Carrom", "Commander", "Empire", "Board"] },
    { genre: "Rhythm", mechanics: ["tiles", "jump", "switch"], roots: ["Beat", "Piano", "Rhythm", "Tempo", "Note", "Drum", "Wave", "Melody"] },
    { genre: "Adventure", mechanics: ["maze", "jump", "lane"], roots: ["Quest", "Escape", "Dungeon", "Hero", "Island", "Portal", "Treasure", "Jungle"] },
    { genre: "Word", mechanics: ["tiles", "grid"], roots: ["Word", "Quiz", "Letter", "Spell", "Cipher", "Trivia", "Riddle", "Code"] },
    { genre: "Casual", mechanics: ["match", "cards", "tiles", "switch", "stack", "bird"], roots: ["Candy", "Cards", "Cooking", "Farm", "Pet", "Garden", "Color", "Bird", "Bubble"] },
    { genre: "Platformer", mechanics: ["jump", "lane", "runner"], roots: ["Doodle", "Redball", "Lava", "Obby", "Climb", "Hero", "Bunny", "Platform"] },
    { genre: "Board", mechanics: ["cards", "grid", "orbit", "tiles"], roots: ["Cards", "Ludo", "Chess", "Carrom", "Solitaire", "Mahjong", "Dice", "Checkers", "Domino"] }
  ];
  const themes: Array<{ title: string; genre: string; mechanic: string }> = [];
  for (const blueprint of blueprints) {
    let made = 0;
    for (const prefix of prefixes) {
      for (const rootName of blueprint.roots) {
        for (const world of worlds) {
          for (const mode of modes) {
            const mechanic = blueprint.mechanics[(made + prefix.length + rootName.length) % blueprint.mechanics.length];
            themes.push({ title: `${prefix} ${rootName} ${world} ${mode}`, genre: blueprint.genre, mechanic });
            made += 1;
            if (made >= 720) break;
          }
          if (made >= 720) break;
        }
        if (made >= 720) break;
      }
      if (made >= 720) break;
    }
  }
  return themes;
}

function uniqueCatalogNames(names: string[]) {
  const seen = new Set<string>();
  return names
    .map((name) => name.replace(/\s+/g, " ").trim())
    .filter((name) => {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function inferGenre(title: string) {
  const name = title.toLowerCase();
  if (/(2048|sudoku|tetris|mahjong|solitaire|candy|bubble|word|quiz|match|merge|puzzle|rope|mine|memory|code|prism|tile)/.test(name)) return "Puzzle";
  if (/(car|kart|moto|drift|race|traffic|road|rider|highway|ramp)/.test(name)) return "Racing";
  if (/(shooter|blast|bullet|tank|space|invader|alien|sniper|war|strike|laser|marine)/.test(name)) return "Shooter";
  if (/(football|basket|pool|bowling|penalty|goal|tennis|golf|cricket|sport)/.test(name)) return "Sports";
  if (/(chess|ludo|carrom|solitaire|tac|ladder|board)/.test(name)) return "Board";
  if (/(run|dash|slope|subway|temple|dino|runner|rush|jump|parkour|slide|flappy|bird|crossy)/.test(name)) return "Runner";
  if (/(quest|dungeon|island|jungle|escape|hero|adventure)/.test(name)) return "Adventure";
  return "Arcade";
}

function inferMechanic(title: string) {
  const name = title.toLowerCase();
  if (/(candy|jewel|gem|sweet|match 3|match-3|sugar|skydom)/.test(name)) return "match";
  if (/(card|cards|memory|solitaire|mahjong|poker|blackjack)/.test(name)) return "cards";
  if (/(bike|bmx|moto|motorcycle|ramp|stunt)/.test(name)) return "bike";
  if (/(flappy|bird|rocket|flight|blumgi|comet|gravity bird)/.test(name)) return "bird";
  if (/(jump|doodle|helix|redball|flip|bunny|parkour|climb|leap|yoyo|high jump|magma|space jump)/.test(name)) return "jump";
  if (/(crossy|paper|slither|ziggy|lane|tag|trail|subway|temple|surf|sprint)/.test(name)) return "lane";
  if (/(car|kart|moto|drift|race|traffic|highway|road fighter|ramp|racer)/.test(name)) return "kart";
  if (/(football|basket|pool|bowling|penalty|goal|tennis|golf|cricket|rope|angry|launcher|flick|dunk)/.test(name)) return "arc";
  if (/(maze|mine|pac|escape|room|door|labyrinth)/.test(name)) return "maze";
  if (/(snake|grid|ludo|chess|tic|sudoku|whack|mole|bomber|hardest|field|connect|defense)/.test(name)) return "grid";
  if (/(stack|tower|stacktris)/.test(name)) return "stack";
  if (/(brick|breaker|pinball)/.test(name)) return "breaker";
  if (/(2048|tetris|tile|word|quiz|merge|puzzle|code|prism|painting|color by|block)/.test(name)) return "tiles";
  if (/(flappy|bird|rocket|flight|blumgi|comet|space jump|gravity bird)/.test(name)) return "bird";
  if (/(switch|color|bubble|simon|rgb|zuma|loop)/.test(name)) return "switch";
  if (/(orbit|orbital|coil|bouncing|ball|circle|spiral)/.test(name)) return "orbit";
  if (/(blade|slice|fruit ninja|slasho|slash|ninja)/.test(name)) return "blade";
  if (/(tunnel|void|vortex|cyclone)/.test(name)) return "tunnel";
  if (/(shadow|kombat|zombie|outbreak|dark)/.test(name)) return "shadow";
  if (/(shooter|bullet|blast|invader|alien|sniper|war|strike|laser|marine|tank|fighter)/.test(name)) return "laser";
  return "runner";
}

function generateCatalogNames() {
  const prefixes = [
    "Neon", "Cyber", "Pixel", "Turbo", "Galaxy", "Crystal", "Shadow", "Rocket", "Nitro", "Hyper",
    "Cosmic", "Metro", "Laser", "Quantum", "Nova", "Storm", "Apex", "Blaze", "Phantom", "Velocity",
    "Gravity", "Orbit", "Mystic", "Arcade", "Jungle", "Temple", "Sky", "Ocean", "Desert", "Arctic",
    "Dragon", "Robot", "Ninja", "Pirate", "Hero", "Monster", "Alien", "Zombie", "Wizard", "Knight"
  ];
  const roots = [
    "Runner", "Dash", "Jump", "Rush", "Maze", "Grid", "Snake", "Shooter", "Blaster", "Invaders",
    "Kart", "Drift", "Racer", "Puzzle", "Merge", "Blocks", "Tiles", "Breaker", "Stack", "Switch",
    "Bubble", "Match", "Quest", "Defense", "Arena", "Flight", "Flap", "Tunnel", "Orbit", "Slice",
    "Strike", "Clash", "Dodge", "Hop", "Slide", "Tower", "Pool", "Goal", "Basket", "Word",
    "Sudoku", "Chess", "Ludo", "Carrom", "Solitaire", "2048", "Tetris", "Mahjong", "Pinball", "Dino"
  ];
  const suffixes = [
    "X", "Pro", "Rush", "World", "Arena", "Quest", "Zone", "Legends", "Fever", "Storm",
    "Dash", "Clash", "Master", "Challenge", "Sprint", "Mania", "Stars", "League", "Classic", "Blast",
    "Extreme", "Deluxe", "Heroes", "3D", "2D"
  ];
  const names: string[] = [];
  for (const prefix of prefixes) {
    for (const rootName of roots) {
      names.push(`${prefix} ${rootName}`);
      if (names.length % 3 === 0) names.push(`${prefix} ${rootName} ${suffixes[(names.length + prefix.length) % suffixes.length]}`);
    }
  }
  return names;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[char];
  });
}

function avatarData(seed: string, label: string) {
  const palettes = [
    ["#F50575", "#09090B"],
    ["#00E5FF", "#09090B"],
    ["#A15CFF", "#09090B"],
    ["#FFB703", "#09090B"],
    ["#FFFFFF", "#2D2D2D"]
  ];
  const code = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const [accent, bg] = palettes[code % palettes.length];
  const safeLabel = escapeHtml(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${bg}"/><circle cx="48" cy="48" r="38" fill="${accent}" opacity=".18"/><path d="M24 67 48 19l24 48-24-14-24 14Z" fill="${accent}"/><text x="48" y="82" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="900" text-anchor="middle">${safeLabel}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("ZEEL seed complete. Login with test@test.com / password123 or zeel@test.com / password123");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
