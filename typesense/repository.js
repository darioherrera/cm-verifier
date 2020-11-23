let schema = {
    "name": "repository",
    "fields": [{
            "name": "_id",
            "type": "string"
        },
        {
            "name": "name",
            "type": "string"
        },
        {
            "name": "description",
            "type": "string"
        },
        {
            "name": "url",
            "type": "string"
        },
        {
            "name": "home",
            "type": "string"
        },
        {
            "name": "gmt_offset",
            "type": "string"
        },
        {
            "name": "timezone_string",
            "type": "string"
        },
        {
            "name": "metatitle",
            "type": "string"
        },
        {
            "name": "metadesc",
            "type": "string"
        },
        {
            "name": "lang",
            "type": "string"
        },
        {
            "name": "metakeywords",
            "type": "string"
        },
        {
            "name": "favicon",
            "type": "string"
        },
        {
            "name": "og_title",
            "type": "string"
        },
        {
            "name": "og_description",
            "type": "string"
        },
        {
            "name": "og_image",
            "type": "string"
        },
        {
            "name": "og_locale",
            "type": "string"
        },
        {
            "name": "og_twitter",
            "type": "string"
        },
        {
            "name": "code",
            "type": "int64"
        }
    ],
    "default_sorting_field": "code"
}


module.exports = {schema};