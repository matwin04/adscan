import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const VIEWS_DIR = path.join(__dirname, "views");
const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = process.env.PORT || 3003;

app.engine("html", engine({ extname: ".html", defaultLayout: false }));
app.set("view engine", "html");
app.set("views", VIEWS_DIR);
app.use("/public", express.static(PUBLIC_DIR));

const source = JSON.parse(fs.readFileSync("./data/sources.json")).folder;
const root = `./data/${source}`;
app.get("/", (req, res) => {
    res.render("index", {})
});
// ---------- /ads_information (single view for all subfiles) ----------
app.get("/ads_information/videos_watched", (req, res) => {
    const base = `${root}/ads_information`;
    const videos = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/videos_watched.json`)).impressions_history_videos_watched.map(entry => ({
        author: entry.string_map_data.Author.value,
        time: new Date(entry.string_map_data.Time.timestamp * 1000).toLocaleString()
    }));
    res.render("ads_information/videos_watched", {
        videos,
        title: "Videos Watched",
    });
});
app.get("/ads_information/ads_clicked", (req, res) => {
    const ads_clicked = JSON.parse(fs.readFileSync(`${root}/ads_information/ads_and_topics/ads_clicked.json`)).impressions_history_ads_clicked.map(entry => ({
        creator: entry.title,
        time: new Date(entry.string_list_data[0].timestamp * 1000).toLocaleString()
    }));
    res.render("ads_information/ads_clicked", {
        ads_clicked,
        title: "Ads clicked",
    });
});
app.get("/ads_information/ads_viewed", (req, res) => {
    const base = `${root}/ads_information`;
    const ads_viewed = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/ads_viewed.json`)).impressions_history_ads_seen.map(entry => ({
        author: entry.string_map_data.Author.value,
        time: new Date(entry.string_list_data[0].timestamp * 1000).toLocaleString()
    }));
    res.render("ads_information/ads_viewed", {
        ads_viewed,
        title: "Ads Seen",
    });
});
app.get("/activity/liked_posts", (req, res) => {
    const base = `${root}/your_instagram_activity`;
    const liked_posts = JSON.parse(fs.readFileSync(`${base}/likes/liked_posts.json`)).likes_media_likes.map(entry => ({
        postTitle: entry.title,
        link: entry.string_list_data[0].href || "#",
        time: new Date(entry.string_list_data[0].timestamp * 1000).toLocaleString()
    }));
    res.render("your_instagram_data/likes", {
        liked_posts,
        title: "Liked Posts",
    });
});
app.get("/activity/saved_posts", (req, res) => {
    const base = `${root}/your_instagram_activity`;
    const saved_posts = JSON.parse(fs.readFileSync(`${base}/saved/saved_posts.json`)).saved_saved_media.map(entry => ({
        postTitle: entry.title,
        link: entry.string_map_data["Saved on"].href || "#",
        time: new Date(entry.string_map_data["Saved on"].timestamp * 1000).toLocaleString()
    }));
    res.render("your_instagram_data/saved", {
        saved_posts,
        title: "Saved Posts",
    });
});
app.get("/ads_information", (req, res) => {
    const base = `${root}/ads_information`;

    const videos = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/videos_watched.json`)).impressions_history_videos_watched.map(entry => ({
        author: entry.string_map_data.Author.value,
        time: new Date(entry.string_map_data.Time.timestamp * 1000).toLocaleString()
    }));

    /*const posts = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/posts_viewed.json`)).impressions_history_posts_seen.map(entry => ({
        author: entry.string_map_data.Author.value,
        time: new Date(entry.string_map_data.Time.timestamp * 1000).toLocaleString()
    }));

    const profiles = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/profiles_you're_not_interested_in.json`)).impressions_history_recs_hidden_authors.map(entry => ({
        username: entry.string_map_data.Username.value,
        time: new Date(entry.string_map_data.Time.timestamp * 1000).toLocaleString()
    }));

    const adsClicked = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/ads_clicked.json`)).impressions_history_ads_clicked.map(entry => ({
        id: entry.string_map_data["Ad ID"].value,
        time: new Date(entry.string_map_data.Time.timestamp * 1000).toLocaleString()
    }));

    const adsViewed = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/ads_viewed.json`)).impressions_history_ads_seen.map(entry => ({
        id: entry.string_map_data["Ad ID"].value,
        time: new Date(entry.string_map_data.Time.timestamp * 1000).toLocaleString()
    }));

    const inAppMessages = JSON.parse(fs.readFileSync(`${base}/ads_and_topics/in-app_message.json`)).impressions_history_app_message.map(entry => ({
        name: entry.string_map_data["In-app message name"].value,
        click: entry.string_map_data["Click type"].value,
        count: entry.string_map_data["Count"].value
    }));

    const categories = JSON.parse(fs.readFileSync(`${base}/instagram_ads_and_businesses/other_categories_used_to_reach_you.json`)).inferred_categories.map(entry => ({
        name: entry.name,
        audience: entry.audience_network
    }));*/

    res.render("ads_information", {
        videos,
        //posts,
        //profiles,
        //adsClicked,
        //adsViewed,
        //inAppMessages,
        //categories
    });
});


app.listen(PORT, () => {
    console.log(`🌐 Server running at http://localhost:${PORT}`);
});