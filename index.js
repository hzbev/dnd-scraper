import axios from 'axios';
import { parse } from 'node-html-parser';
import { writeFileSync, existsSync, mkdirSync } from "fs"

async function getLinks(link) {
    if (!existsSync(`files/${link}/`)) {
        mkdirSync(`files/${link}/`);
    }
    
    const response = await axios.get(`http://dnd5e.wikidot.com/spells:${link}`);
    const root = parse(response.data);
    const yuiContent = root.querySelector('.yui-content');
    if (yuiContent) {
        const children = yuiContent.childNodes;
        for (const child in children) {
            const childDocument = parse(children[child].toString());
            const anchors = childDocument.querySelectorAll('a');
            for (const anchor of anchors) {
                await getData(anchor.getAttribute('href'), children[child].getAttribute("id").slice(11), link);
            }
        }
    }

}

async function getData(link, tabIndex, linkss) {
    if (!existsSync(`files/${linkss}/${tabIndex}/`)) {
        mkdirSync(`files/${linkss}/${tabIndex}/`);
    }
    const response = await axios.get(`http://dnd5e.wikidot.com${link}`);
    const root = parse(response.data);
    const pageTitle = root.querySelector('.page-title').innerText.trim();
    const pageContent = root.querySelector('#page-content').innerText.trim();
    writeFileSync(`files/${linkss}/${tabIndex}/${pageTitle.replace("/", "-")}.txt`, pageTitle + "\n" + pageContent)
    console.log(`Saved ${pageTitle}`)
}


// getData("/spell:blade-ward", 9)

let cate = ["enchantment", "evocation", "illusion", "necromancy", "transmutation"]

for (let i of cate) {
    await getLinks(i)
}