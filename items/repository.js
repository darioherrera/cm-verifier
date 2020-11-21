const got = require("got");
const headers = ["metatitle", "metadesc", "lang", "metakeywords", "favicon", "og_locale", "og_image", "og_twitter", "registerDate"]

const parse = async ($) => {
    const element = {};
    try {
        element.metatitle = $("title").text() || '';
        element.metadesc = $("meta[name='description']").attr('content') || '';
        element.lang = $("html").attr("lang") || '';
        // element.metatitle = $("meta[name='description']").attr('content');
        element.metakeywords = $("meta[name='keywords']").attr('content') || '';
        element.favicon = $("link[rel='icon']").attr('href') || '';
        element.og_locale = $("meta[name='og:locale']").attr('content') || '';
        element.og_image = $("meta[name='og:image']").attr('content') || '';
        element.og_twitter = $("meta[name='twitter:site']").attr('content') || '';
        element.valid = true;
        element.registerDate = Date.now()
    }
    catch (error) {

    }
    return element;
}

module.exports = { parse, headers }
