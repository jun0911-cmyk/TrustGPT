export default class Search {
    constructor () {}

    setTemplate(link, className) {
        return `
        <div class="search-data">
            <div class="${className}">
                <button type="button" id="vote-btn" class="btn btn-info">Trust this link</button>
                <button type="button" class="btn btn-success"><a href="${link}">Visit To Page</a></button>
            </div>
            <div class="frame-container"><iframe id="${link}" src="${link}" frameborder="1" style="width: 100%; height: 100%; border: 2px solid black;" class="sitemapIframe"></iframe></div>
        </div>
        `
    }

    appendContent(container, searchData) {
        container.innerHTML = "";

        Object.keys(searchData).forEach((key) => {
            const search = searchData[key];

            for (let i = 0; i < search.length; i++) {
                const searchObj = search[i];

                let className = "first-button-container";

                if (i != 0) className = "button-container";

                container.innerHTML += this.setTemplate(searchObj.link, className);
            }
        });
    }
}