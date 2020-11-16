const got = require("got");

const parse = async ($, url) => {
    let element = {};
    try {
        const site = await got.get(`${url}/wp-json`).json();
        const categories = await got.get(`${url}/wp-json/wp/v2/categories`).json();
        element.metatitle = $("title").text();
        element.metadesc = $("meta[name='description']").attr('content');
        element.lang = $("html").attr("lang");
        // element.metatitle = $("meta[name='description']").attr('content');
        element.metakeywords = $("meta[name='keywords']").attr('content');
        element.favicon = $("link[rel='icon']").attr('href');
        element.og_locale = $("meta[name='og:locale']").attr('content');
        element.og_image = $("meta[name='og:image']").attr('content');
        element.og_twitter = $("meta[name='twitter:site']").attr('content');
        if (site) {
            element.name = site.name;
            element.description = site.description;
            element.url = site.url;
            element.timezone = site.timezone_string;
        }
        if (categories) {
            element.categories = categories.map(cat => cat.name);
        }
        element.valid = true;
        return element;
    } catch (error) {
        if (error instanceof got.HTTPError) {
            element.valid = false;
            console.log(`Error ${error.statusCodes} on: ${url} `);
            return { error: true, url };
        }

        return null;
    }
}

module.exports = { parse }