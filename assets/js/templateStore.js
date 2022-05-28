const templateStore = [
    {
        'id': 1,
        'type': 'template',
        'preview': 'assets/images/previews/black/form_preview--black.svg',
        'title': 'Form',
        'template': 'form',
        'content': 'templates/html/form.html',
        'inputs': [
            {
                'id': 'f-name',
                'title': 'First name',
                'type': 'text',
                'textarea': 'false',
            },
            {
                'id': 'l-name',
                'title': 'Last name',
                'type': 'text',
                'textarea': 'false',
            },
            {
                'id': 'email',
                'title': 'The email address',
                'type': 'email',
                'textarea': 'false',
            },
            {
                'id': 'gdpr',
                'title': 'The GDPR consent',
                'type': 'checkbox',
                'textarea': 'false',
            },
            {
                'id': 'file',
                'title': 'The file',
                'type': 'file',
                'textarea': 'false',
            },
            {
                'id': 'message',
                'title': 'The message text',
                'type': 'text',
                'textarea': 'true',
            },
            {
                'id': 'submit',
                'title': 'The submit button',
                'type': 'submit',
                'textarea': 'false',
            }
        ]
    },
    {
        'id': 18,
        'type': 'template',
        'preview': 'assets/images/previews/black/file-upload_preview--black.svg',
        'title': 'File Upload Template',
        'template': 'component',
        'content': 'templates/html/file-upload-template.html',
    },
    {
        'id': 12,
        'type': 'template',
        'preview': 'assets/images/previews/black/hero_preview--black.svg',
        'title': 'Hero template',
        'template': 'component',
        'content': 'templates/html/hero_template.html',
    },
    {
        'id': 2,
        'type': 'template',
        'preview': 'assets/images/previews/black/text_preview_2--black.svg',
        'title': 'Template 1',
        'template': 'component',
        'content': 'templates/html/template.html',
    },
    {
        'id': 3,
        'type': 'template',
        'preview': 'assets/images/previews/black/text_preview--black.svg',
        'title': 'Template 5',
        'template': 'component',
        'content': 'templates/html/template_5.html',
    },
    {
        'id': 4,
        'type': 'template',
        'preview': 'assets/images/previews/black/text+image_preview--black.svg',
        'title': 'Template 2',
        'template': 'component',
        'content': 'templates/html/template_2.html',
    },
    {
        'id': 5,
        'type': 'template',
        'preview': 'assets/images/previews/black/text-in-columns_template--black.svg',
        'title': 'Template 3',
        'template': 'component',
        'content': 'templates/html/template_3.html',
    },
    {
        'id': 6,
        'type': 'template',
        'preview': 'assets/images/previews/black/img_preview--black.svg',
        'title': 'Template 4',
        'template': 'component',
        'content': 'templates/html/template_4.html',
    },
    {
        'id': 7,
        'type': 'template',
        'preview': 'assets/images/previews/black/editor_preview--black.svg',
        'title': 'Editor',
        'template': 'editor',
        'content': 'templates/html/editor.html',
    },
    {
        'id': 8,
        'type': 'template',
        'preview': 'assets/images/previews/black/product_preview-1--black.svg',
        'title': 'Product Template',
        'template': 'component',
        'content': 'templates/html/product-template.html',
    },
    {
        'id': 9,
        'type': 'template',
        'preview': 'assets/images/previews/black/product_preview-2--black.svg',
        'title': 'Product Template Alt',
        'template': 'component',
        'content': 'templates/html/product-template_alt.html',
    },
    {
        'id': 10,
        'type': 'template',
        'preview': 'assets/images/previews/black/product_preview-3--black.svg',
        'title': 'Product Template 3',
        'template': 'component',
        'content': 'templates/html/product-template_three.html',
    },
    {
        'id': 11,
        'type': 'template',
        'preview': 'assets/images/previews/black/inst_preview--black.svg',
        'title': 'Insta template',
        'template': 'component',
        'content': 'templates/html/insta-template.html',
    },
    {
        'id': 19,
        'type': 'template',
        'preview': 'assets/images/previews/black/yt_preview--black.svg',
        'title': 'Youtube template',
        'template': 'component',
        'content': 'templates/html/youtube-template.html',
    },
    {
        'id': 14,
        'type': 'template',
        'preview': 'assets/images/previews/black/gallery_preview--black.svg',
        'title': 'Gallery',
        'template': 'gallery',
        'content': 'templates/html/gallery_template.html',
        'appearance': [
            {
                'title': 'type-a',
                'preview': 'assets/images/previews/gallery_type-1_preview.svg',
                'content': 'galleries/html/type_a.html'
            },
            {
                'title': 'type-b',
                'preview': 'assets/images/previews/gallery_type-2_preview.svg',
                'content': 'galleries/html/type_b.html'
            }
        ]
    },
    {
        'id': 20,
        'type': 'template',
        'preview': 'assets/images/previews/black/product_preview-3--black.svg',
        'title': 'Products template',
        'template': 'products',
        'content': 'templates/html/products_template.html',
        'data': [
            {
                'id': 'p-1',
                'title': 'product',
                'href': '/product',
                'thumbnail': 'assets/images/thumbnails/product_thumbnail--B.jpg'
            },
            {
                'id': 'p-2',
                'title': 'product 2',
                'href': '/product',
                'thumbnail': 'assets/images/thumbnails/product_thumbnail--B.jpg'
            },
            {
                'id': 'p-3',
                'title': 'product 3',
                'href': '/product',
                'thumbnail': 'assets/images/thumbnails/product_thumbnail--B.jpg'
            },
        ]
    },
    {
        'id': 15,
        'type': 'layout',
        'preview': 'assets/images/previews/black/layout_preview--black.svg',
        'title': 'Layout 1',
        'template': 'component',
        'content': 'templates/html/layout.html',
    },
    {
        'id': 16,
        'type': 'layout',
        'preview': 'assets/images/previews/black/layout_preview-2--black.svg',
        'title': 'Layout 2',
        'template': 'component',
        'content': 'templates/html/layout_2.html',
    },
    {
        'id': 17,
        'type': 'layout',
        'preview': 'assets/images/previews/black/layout_preview-3--black.svg',
        'title': 'Layout 3',
        'template': 'component',
        'content': 'templates/html/layout_3.html',
    },
    {
        'type': 'theme',
        'preview': 'assets/images/previews/theme_preview-standard.svg',
        'title':  'Standard theme',
        'class': 'standard-theme',
        'colors': {
            'background': 'transparent',
            'text': 'black',
            'pattern': false,
        }
    },
    {
        'type': 'theme',
        'preview': 'assets/images/previews/theme_preview-dark.svg',
        'title':  'Dark theme',
        'class': 'dark-theme',
        'colors': {
            'background': 'black',
            'text': 'white',
            'pattern': false,
        }
    },
    {
        'type': 'theme',
        'preview': 'assets/images/previews/theme_preview-orange.svg',
        'title':  'Orange theme',
        'class': 'orange-theme',
        'colors': {
            'background': 'orange',
            'text': 'white',
            'pattern': false,
        }
    }
]