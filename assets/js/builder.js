const app = (() => {
    let uploadedFiles = 0;
    let loadedTemplate = null;
    let loadedGalleryType = null;
    let currentEditable = null;
    let currentGallery = null;
    let inactiveEditable = [];
    let deletableFiles = [];
    let dragIsActive = false;
    let firstDropIsDone = false;
    let itemIsDragged = false;
    let deleteBtnIsExist = false;

    const contentStore = $(`#content-store`);
    const editorField = $('.page-builder__editable-area');
    const grammerlyTags = "data-gramm='false' data-gramm_editor='false' data-enable-grammarly='false'";
    const dividerElem =
        $(`<div class='droppable droppable-divider'>
                <div class='droppable-divider__inner'>
                    <div class='drop-icon'></div>
                    <svg width='1321' height='1' viewBox='0 0 1321 1' fill='none' xmlns='http://www.w3.org/2000/svg'><line y1='0.5' x2='1321' y2='0.5' stroke='#00000'/></svg>
                </div>
            </div>`)[0].outerHTML;
    const spinner =
        $(`<svg class='spinner' viewBox='0 0 50 50'>
                    <circle class='path' cx='25' cy='25' r='20' fill='none' stroke-width='5'></circle>
                </svg>`);
    const loader =
        $(`<div class="loader-wrapper">
                    <svg class="loader" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <circle cx="30" cy="30" r="28"/>
                        </g>
                     </svg>
                    <span class="loader-progress-wrapper">
                        <span class="loader-progress"></span>
                        <span>%</span>
                    </span>
                </div>`);

    // Handler function for get templates. (Recomennded for static builds)
    const _getTemplate = (template) => {
        let data = ''
        $.ajax({
            type: 'POST',
            url: window.location.origin + '/builder/' + template,
            dataType: 'html',
            async: false,
            success: function (response) {
                data = response
            }
        });
        return data
    }

    const _drag = (() => {
        const previewCard = $('.page-builder__sidebar .sidebar-item--draggable');

        const preview = () => {
            const sidebar = $('.page-builder__sidebar');
            previewCard.draggable({
                scope: 'preview',
                helper: 'clone',
                start: function () {
                    const templateType = templateStore.find(data => data.id == $(this).data('id')).type
                    $('.layout__col').each(function () {
                        if (templateType === 'layout') {
                            $(this).addClass('is-not-droppable')
                        } else {
                            $(this).removeClass('is-not-droppable')
                        }
                    });

                    $('.ui-draggable-dragging').css({
                        'width': `${$(this).width()}px`,
                        'pointer-events': 'none',
                        'opacity': '.6'
                    });
                    sidebar.addClass('overflow-visible')

                    _handleLayouts()

                    dragIsActive = !dragIsActive
                }
            });
            previewCard.on('dragstop', function () {
                let template = templateStore.find(data => data.id == $(this).data('id'));

                // This is a placeholder method for temporary operation
                const loadedContent = $(_getTemplate(template.content));
                console.log(loadedContent)
                const _loadTemplate = () => {
                    loadedTemplate = loadedContent[0].outerHTML
                }

                sidebar.removeClass('overflow-visible')

                if (template.template === 'gallery') {
                    _initGalleryTypes(loadedContent.find('.gallery-types__inputs'))
                    _loadTemplate()
                } else if (template.template === 'editor') {
                    loadedContent.find('[data-editable]').attr('id', _createId(10))
                    _initEditor(loadedContent.find('[data-editable]').attr('id'), true)
                    _loadTemplate()
                } else if (template.template === 'form') {
                    _initFormInputTypes(loadedContent.find('.form-input-types'))
                    _loadTemplate()
                } else if (template.template === 'products') {
                    template.data.forEach(function (product) {
                        loadedContent.find('select').attr('id', _createId(10))
                        const result =
                            $(`<option value="${product.id}" data-thumbnail="${product.thumbnail}" data-title="${product.title}" data-href="${product.href}">
                                            ${product.title}
                                        </option>`)
                        loadedContent.find('select').append(result)
                    })
                    _loadTemplate()
                } else {
                    //loadedTemplate = template.content
                    loadedTemplate = loadedContent[0].outerHTML
                }

                dragIsActive = !dragIsActive
            });
        };
        const template = (that) => {
            that.draggable({
                scope: "template",
                revert: true,
                handle: that.children('.control-btns-wrapper').find('.drag-template-btn'),
                revertDuration: 0,
                start: function (event, ui) {
                    ui.helper.parents('.page-builder__editable-area').addClass('area-active')
                    ui.helper.addClass("draggable");

                    if (ui.helper.is('[data-editor]')) {
                        const editorId = ui.helper.find('[data-editable]').attr('id')
                        tinymce.execCommand('mceRemoveEditor', true, editorId)
                    }

                    _handleLayouts()

                    itemIsDragged = !itemIsDragged
                    dragIsActive = !dragIsActive
                },
                stop: function (event, ui) {
                    ui.helper.parents('.page-builder__editable-area').removeClass('area-active')
                    that.removeClass("draggable");

                    if (ui.helper.is('[data-editor]')) {
                        const editorId = ui.helper.find('[data-editable]').attr('id')
                        _initEditor(editorId, true,)
                    }

                    itemIsDragged = !itemIsDragged
                    dragIsActive = !dragIsActive
                }
            });
        };

        return {
            preview,
            template
        };
    });

    const _drop = (() => {
        const preview = (target) => {
            editorField.droppable({
                scope: "preview",
                hoverClass: "area-active",
                drop: function () {
                    if (itemIsDragged) return
                    setTimeout(() => {
                        if (!target.is('.droppable-divider *, .droppable-divider')) {
                            editorField.append(`${!firstDropIsDone ? dividerElem + loadedTemplate + dividerElem : loadedTemplate + dividerElem}`)
                            firstDropIsDone = true
                        } else {
                            target.closest('.droppable-divider').after(loadedTemplate + dividerElem)
                        }

                        if ($(loadedTemplate).is('[data-editor]')) {
                            const editorId = $(loadedTemplate).find('[data-editable]').attr('id')
                            _initEditor(editorId, true)
                        }

                        if ($(loadedTemplate).is('[data-products]')) {
                            const selectId = $(loadedTemplate).find('select').attr('id')
                            const results = $(loadedTemplate).find('option')
                            const resultDetails = []

                            results.each(function () {
                                const details = {
                                    'productThumbnail': $(this).data('thumbnail'),
                                    'productHref': $(this).data('href'),
                                    'productId': $(this).data('id')
                                }
                                resultDetails.push(details)
                            })

                            _initSelectInput(false, $('#' + selectId))
                        }

                        _disableGrammerly()
                        _initGalleryTypes()
                        _handleLayouts()
                        _removeDoubleDividers()
                        _storeContent()
                    }, 250)

                    _addEditableIds()
                    editorField.addClass('first-drop-is-done')
                }
            })
        }
        const template = (target) => {
            $('.droppable-divider').droppable({
                scope: "template",
                tolerance: 'pointer',
                drop: function (event, ui) {
                    target.closest('.droppable-divider').after(ui.draggable);

                    if ($(ui)[0].draggable.is('[data-editor]')) {
                        const editorId = $(ui)[0].draggable.find('p').attr('id')

                        _initEditor(editorId, true)
                    }

                    ui.draggable.after(dividerElem)

                    _handleLayouts()
                    _removeDoubleDividers()
                    _storeContent()
                }
            });
        }

        return {
            preview,
            template
        }
    })

    const _initSideBar = () => {
        templateStore.forEach(function (item) {
            const sidebar = $('.page-builder__sidebar-inner')
            let themeId = _createId(10)
            const sidebarElem =
                $(`<div class='sidebar-item sidebar-item--draggable' data-id='${item.id}' data-preview='${item.type}'>
                        <div class='sidebar-item__img'>
                            <img src='${item.preview}' alt=''/>
                        </div>
                        <span class='siderbar-item__title'>${item.title}</span>
                    </div>`)
            const themeCard =
                $(`<div class="sidebar-item sidebar-item--theme">
                            <div class="theme theme-preview" data-preview='${item.type}'>
                                <input type="radio" class="theme__input" id="${themeId}" data-theme="${item.class}" name="theme">
                                <label class="theme__label" for="${themeId}"><img class="theme__preview" src="${item.preview}" alt="">${item.title}</label>
                            </div>
                        </div>`)

            if (item.type === 'theme') {
                sidebar.append(themeCard)
            } else {
                sidebar.append(sidebarElem)
            }
        });
    }

    const _initTabs = () => {
        let tabs = [];

        templateStore.forEach(function (item) {
            if (tabs.includes(item.type)) return
            tabs.push(item.type)
        })

        tabs.forEach(function (item) {
            const tab = $(`<span class='page-builder__sidebar-tab' data-type=${item}>${item}</span>`)
            $('.page-builder__sidebar-tabs').append(tab)
        })

        $('.page-builder__sidebar-tab').first().addClass('active')
    }

    const _setTheme = (that) => {
        let activeTheme = that.data('theme')
        editorField.attr('data-theme', activeTheme)
        _storeContent()
    }

    const _initGalleryTypes = (that) => {
        templateStore.forEach(function (item) {
            if (typeof item.appearance === 'undefined') return
            item.appearance.forEach(function (elem) {
                let typeId = _createId(10)

                const galleryTypeCard =
                    $(`<div class="gallery-types__input-wrapper">
                                <input class="gallery-type__input" type="radio" id="${typeId}" data-title="${elem.title}" name="gallery-type">
                                <label class="gallery-type__label" for="${typeId}">
                                <span class="gallery-type__img-wrapper">
                                    <img src="${elem.preview}" alt="${elem.title}">
                                </span>
                                ${elem.title}</label>
                            </div>`)
                $(that).append(galleryTypeCard)
            })
        });
    }

    const _initSwiper = () => {
        const swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            centeredSlides: true,
            pagination: {
                el: '.swiper-pagination',
            },

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    }

    const _previewGalleryType = (that) => {
        const gallery = that.closest('[data-gallery]')
        const images = gallery.find('.uploaded-file')
        const selectedType = gallery.find('.type-is-selected')

        gallery.attr('data-type', selectedType.data('title'))
        gallery.toggleClass('preview-is-active')

        options.forEach(function (item) {
            if (item.template !== 'gallery') return
            loadedGalleryType = item.appearance.find(data => data.title == selectedType.data('title')).content
        })

        images.each(function () {
            const galleryPreview = $(loadedGalleryType)
            const imgSrc = $(this).find('img').attr('src')
            const imgCaption = $(this).find('.img-caption').val()
            const slide =
                $(`<div class="swiper-slide">
                                <img class="slide-img" src="${imgSrc}" alt="">
                                <span class="img-caption">${imgCaption}</span>
                            </div>`)
            galleryPreview.find('[data-slides]').append(slide)
            loadedGalleryType = galleryPreview[0].outerHTML
        })

        if (!gallery.find('.gallery-preview').length) {
            const galleryPreview = $(`<div class="gallery-preview">${loadedGalleryType}</div>`)
            that.closest('[data-gallery]').append(galleryPreview)
            _initSwiper()
        } else {
            gallery.attr('data-type', '').find('.gallery-preview').remove()
            setTimeout(function () {
                gallery.addClass('is-selected')
            }, 250)
            loadedGalleryType = ''
        }
    }

    const _initFormInputTypes = (that) => {
        templateStore.forEach(function (item) {
            if (typeof item.inputs === 'undefined') return

            item.inputs.forEach(function (elem) {
                let optionId = elem.id + '-' + $('[data-form]').length

                const formOptions =
                    $(`<div class="form-input">
                                <input class="form-input__option" type="checkbox" id="${optionId}" data-id="${elem.id}">
                                <label for="${optionId}">${elem.title}</label>
                            </div>`)

                $(that).append(formOptions)
            })
        });
    }

    const _addFormElement = (that) => {
        let inputId = _createId(10)
        const dataId = that.data('id')
        const templateId = that.closest('[data-template]').data('template')
        const inputs = templateStore.find(data => data.id == templateId).inputs
        const type = inputs.find(data => data.id == that.data('id')).type
        const title = inputs.find(data => data.id == that.data('id')).title
        const isTextarea = inputs.find(data => data.id == that.data('id')).textarea

        const input = `<input placeholder="${title}" type="${type}" id="${inputId}" data-id="${dataId}">`
        const textarea = `<textarea placeholder="${title}" id="${inputId}" data-id="${dataId}"></textarea>`

        const inputType =
            $(`<div class="input-wrapper" data-type="${type}" data-input="${dataId}" data-remove="${that.attr('id')}">
                    ${isTextarea === 'false' ? input : textarea}
                    <label for="${inputId}">${title}</label>
                </div>`)

        that.closest('[data-form]').find('.form').append(inputType)
        _handleFormArea(that)
        _storeContent()
        _makeSortable($('.form'), undefined)
    }

    const _removeFormElement = (that) => {
        that.closest('[data-form]').find('.form .input-wrapper').each(function () {
            if (that.attr('id') !== $(this).data('remove')) return
            $(this).remove()
        })
        _handleFormArea(that)
        _storeContent()
    }

    const _handleFormArea = (that) => {
        const form = that.closest('[data-form]').find('form')

        if (form.find('input').length) {
            that.closest('[data-form]').find('form').addClass('is-updated')
        } else {
            that.closest('[data-form]').find('form').removeClass('is-updated')
        }
    }

    const _destroySelect2 = (that) => {
        that
            .removeAttr('data-select2-id tabindex aria-hidden')
            .removeClass('select2-hidden-accessible')
            .next()
            .remove()
        that.find('option').each(function () {
            that.removeAttr('data-select2-id')
        })
        that.find('.select2-container').each(function () {
            that.remove()
        })
    }

    const _initSelectInput = (globally, that) => {
        const options = {
            allowClear: true,
            theme: "classic",
            width: '100%',
        }
        if (globally) {
            $('select').each(function () {
                if ($(this).is('[data-select2-id]')) return
                $(this).select2(
                    options
                )
            })
        } else {
            that.select2(
                options
            )
        }
    }

    const _changeSelectedProduct = (that, id, remove) => {
        const productTemplate = that.closest('[data-products]')
        const optionId = productTemplate.find(`[value=${id}]`)
        const productHref = optionId.data('href')
        const productThumbnail = optionId.data('thumbnail')
        const productTitle = optionId.data('title')

        const productCard =
            $(`<div class="col-lg-4 px-2" data-id="${id}">
                                <a class="product-card" href="${productHref}">
                                    <div class="product-card__img-wrapper" >
                                        <img class="product-card__img" src="${productThumbnail}">
                                    </div>
                                    <span class="product-card__title">${productTitle}</span>
                                </a>
                            </div>`)

        if (!remove) {
            productTemplate.find('.product-cards-row').append(productCard)
        } else {
            productTemplate.find(`[data-id='${id}']`).remove()
        }
    }

    const _addLoader = (circle, selector, end, seconds) => {
        const percentageCircle = circle;
        const radius = circle.attr('r')
        const circumference = 2 * Math.PI * radius;
        let progress = end / 100;
        let dashoffset = circumference * (1 - progress);

        percentageCircle.css({
            'stroke-dashoffset': dashoffset,
            'transition-duration': `${seconds / 1000}s`
        })

        $({Counter: 0}).animate({
            Counter: selector.text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function () {
                selector.text(Math.ceil(end));
            }
        });
    }

    // Is required to add server-side response and destination for the files
    const _upload = (file, that, droppedfiles) => {
        const formData = new FormData();
        formData.append('fileName', file);
        const started_at = new Date();
        const xhr = new XMLHttpRequest();
        const _removeLoader = () => {
            that.parent().addClass('is-empty').find('.spinner').remove()
        }
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                // Is required to get an XHR response from the backend
                const xhrResp = JSON.parse(xhr.response)
                const dropArea = that.parent()
                const fileName = xhrResp.initialPreviewConfig[0].caption
                const fileSize = xhrResp.initialPreviewConfig[0].size / 1000
                const fileSrc = xhrResp.initialPreviewConfig[0].relativeUrl
                const fileKey = xhrResp.initialPreviewConfig[0].key
                const template = that.closest('[data-template]')
                const _hideInput = () => {
                    _removeLoader()
                    dropArea.next().fadeIn(250)
                    if (template.is('[data-gallery]')) {
                        template
                            .addClass('is-updated')
                            .find('.gallery-img-list-wrapper')
                            .addClass('is-visible')
                    }
                    if (template.is('[data-gallery]')) return
                    dropArea.hide().find('input').attr('required', false)
                }

                const imagePreview =
                    $(`<div data-key='${fileKey}' class='uploaded-file uploaded-file--image' data-image data-content-type='image'>
                                <img src='${fileSrc}' data-original='..images/img-placeholder.svg' alt=''/>
                            </div>`)
                const galleryPreview =
                    $(`<div data-key='${fileKey}' class='uploaded-file uploaded-file--gallery-image'>
                                <div class='img-wrapper'><span class='img-index'></span><img src='${fileSrc}' alt=''/></div>
                                <div class='img-details'>
                                    <div class='text-wrapper'>
                                        <textarea class='img-desc' data-img-desc ${grammerlyTags}></textarea>
                                        <span class='floating-placeholder'>Description</span>
                                    </div>
                                    <div class='text-wrapper'>
                                        <textarea class='img-copyright' data-img-copyright ${grammerlyTags}></textarea>
                                        <span class='floating-placeholder'>Copyright</span>
                                    </div>
                                    <div class='text-wrapper'>
                                        <textarea class='img-caption' data-img-caption ${grammerlyTags}></textarea>
                                        <span class='floating-placeholder'>Caption</span>
                                    </div>
                                </div>
                            </div>`)
                const filePreview =
                    $(`<div data-key='${fileKey}' class='uploaded-file uploaded-file--file' data-file data-content-type='file'>
                                <div class="uploaded-file__inner">
                                    <div class="uploaded-file__icon">
                                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='none' d='M0 0h24v24H0z'/><path d='M21 8v12.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8zm-2 1h-5V4H5v16h14V9zM8 7h3v2H8V7zm0 4h8v2H8v-2zm0 4h8v2H8v-2z'/></svg>
                                    </div>
                                    <div class="uploaded-file__details">
                                        <span class='file-name' data-content-type='file-name'>${fileName}</span>
                                        <span class='file-size' data-content-type='file-size'>${fileSize}kb</span>
                                    </div>
                                </div>
                                <a class="uploaded-file__btn" href='${fileSrc}' download>download</a>
                            </div>`)

                if (template.is('[data-gallery]')) {
                    that.closest('.gallery-drop-area__images')
                        .find('.gallery-img-list')
                        .append(galleryPreview)

                    _countGalleryImages()
                    _handleGalleryInputTypes(template)
                } else {
                    dropArea.after(that.is('[data-image]') ? imagePreview : filePreview)
                }

                if (that.is('[data-file]')) {
                    _hideInput()
                }

                template.find('img').on('load', _debounce(function () {
                    if (template.is('[data-gallery]')) {
                        uploadedFiles++
                        if (droppedfiles === true || (droppedfiles.length !== uploadedFiles)) return
                        _hideInput()
                        uploadedFiles = 0
                    } else {
                        _hideInput()
                    }
                    _storeContent()
                }, 250))

                _storeContent()
            }
        }
        xhr.open('POST', clientOptions.uploadUrl, true);
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const loader = that.next().find('.loader-progress')
                const circle = that.next().find('circle')
                const loaded = e.loaded;
                const total = e.total;
                let seconds_elapsed = (new Date().getTime() - started_at.getTime()) / 1000;
                let bytes_per_second = seconds_elapsed ? loaded / seconds_elapsed : 0;
                let remaining_bytes = total - loaded;
                let seconds_remaining = seconds_elapsed ? remaining_bytes / bytes_per_second : 'calculating';

                //_addLoader(circle, loader, Math.round(loaded / total * 100), Math.round(seconds_remaining * 1000))
            }
        });
        xhr.upload.addEventListener('loadstart', (e) => {
            that.parent().removeClass('is-empty')
            that.parent().append(spinner)
        });
        xhr.upload.addEventListener('loadend', (e) => {
            _storeContent()
        });

        xhr.send(formData);
    }

    const _countGalleryImages = () => {
        setTimeout(function () {
            $('.gallery-img-list').each(function () {
                $(this).find('.img-index').each(function (index) {
                    $(this).text(index + 1)
                })
            })
        }, 250)
    }

    const _handleImgDropArea = () => {
        $('.upload-drop-area').each(function () {
            if ($(this).closest('[data-gallery]').length || $(this).next().hasClass('uploaded-file')) return
            $(this).show()
        })
    }

    const _makeSortable = (list, update) => {
        list.sortable({
            update: function () {
                if (update === undefined) return
                update()
            }
        });
    }

    const _removeUploadedFile = (that) => {
        const uploadInput = that.parent().prev()
        const key = that.parent().data('key')

        deletableFiles.push(key)

        $(`[data-key="${key}]"`).remove()

        if (that.closest('[data-gallery]').find('.uploaded-file').length === 1) {
            that.closest('.gallery-img-list-wrapper').removeClass('is-visible')
        }
        uploadInput
            .removeClass('is-droppable')
            .show().find('input')
            .attr('required', true);
        that.parent().remove();
        $('.upload-drop-area input, .gallery-drop-area input').val('')
        _handleGalleryInputTypes(that.closest('[data-gallery]'))
        _handleLayouts()
        deleteBtnIsExist = false;

        _storeContent()
    }

    const _deleteRemovedFiles = (deletableFile) => {
        const del = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('key', deletableFile);

        del.open('POST', clientOptions.deleteUrl, true);
        del.send(formData);
    }

    const _handleGalleryPreviewBtn = (gallery) => {
        if (gallery.find('.gallery-type__input').hasClass('type-is-selected')) {
            gallery.find('.preview-template-btn').addClass('is-enabled')
        }
    }

    const _handleProductsPreviewBtn = (products) => {
        if (products.find('.select2-selection__choice').length) {
            products.find('.preview-template-btn').addClass('is-enabled')
        } else {
            products.find('.preview-template-btn').removeClass('is-enabled')
        }
    }

    const _previewProductsTemplate = (that) => {
        const template = that.closest('[data-products]')
        const products = template.find('.product-cards-row')
        const templateControls = template.find('.products-template__controls')
        let templateControlsHeight = templateControls.height()

        if (!template.is('.controls-is-hidden')) {
            template.addClass('controls-is-hidden')
            products.css('margin-top', -templateControlsHeight)
            templateControls.css({
                'transform': `translateY(${-templateControlsHeight * 1.25}px)`
            })
        } else {
            template.removeClass('controls-is-hidden')
            products.css('margin-top', 0)
            templateControls.css({
                'transform': `translateY(0)`
            })
        }
    }

    const _handleDropArea = (that) => {
        if (that.closest('.gallery-img-list').children().length > 1) return
        that.closest('[data-gallery]').removeClass('is-updated')
    }

    const _addDeleteImgBtn = (that) => {
        const deleteBtn = $('<div class=\'delete-img-btn\'></div>')

        that.children().last().after(deleteBtn)
        $('.uploaded-file').not(that).children('.delete-img-btn').remove()

        deleteBtnIsExist = !deleteBtnIsExist
    }

    const _handleTabs = () => {
        const activeTab = $('.page-builder__sidebar-tab.active')

        $.each(templateStore, function () {
            $(`[data-preview=${this.type}]`).show()
            if (this.type === activeTab.data('type')) return
            $(`[data-preview=${this.type}]`).hide()
        })
    }

    const _handleLayouts = () => {
        $('.layout__col').each(function () {
            const that = $(this)
            const dividers = $(this).children('.droppable-divider')
            dividers.each(function () {
                if (that.children('.template').length) {
                    $(this).addClass('is-hidden')
                } else {
                    $(this).removeClass('is-hidden')
                }
            });
            if (!dividers.length) {
                $(this).append(dividerElem)
            }
        });
    }

    const _removeDoubleDividers = () => {
        const dividers = $('.droppable-divider')

        dividers.each(function () {
            if (!$(this).next().hasClass('droppable-divider')) return;
            $(this).next().remove()
        })
    }

    const _selectTemplate = (that) => {
        const buttons =
            $(`<div class='control-btns-wrapper'>
                    <div class='remove-template-btn control-btns'></div>
                    <div class='drag-template-btn control-btns'></div>
                    <div class='duplicate-template-btn control-btns'></div>
                    <div class='preview-template-btn control-btns'></div>
                </div>`)

        if (that.is('[data-products]')) {
            _handleProductsPreviewBtn(that)
        }
        if ((that.is('[data-gallery]') || that.is('[data-form]')) && that.find('.control-btns-wrapper').length) {
            that.find('.control-btns-wrapper').show()
            that.addClass('is-selected')
            _handleGalleryPreviewBtn(that)
        } else {
            if (that.hasClass('is-selected')) return;
            that.addClass('is-selected')

            if (that.children('.control-btns-wrapper').length) return;
            that.append(buttons)
        }
        if (that.hasClass('layout') || that.parents('.layout').length) {
            _deselectTemplate($('.layout .template'), that)
        } else {
            _deselectTemplate($('.template'), that)
        }
    }

    const _deselectTemplate = (templates, target, deselectAll) => {
        const hideControlBtns = (that) => {
            if (that.hasClass('is-updated')) {
                that.children('.control-btns-wrapper').hide()
            } else {
                that.children('.control-btns-wrapper').remove()
            }
        }

        $(templates).not(target).each(function () {
            $(this).removeClass('is-selected')
            hideControlBtns($(this))
        })

        if (!deselectAll) return
        _destroyEditors()
        $('.template').removeClass('is-selected');
        hideControlBtns($('.template'))
    }

    const _handleDropIcon = () => {
        if (editorField.children('.template').length) {
            $('.page-builder__editable-area').addClass('first-drop-is-done')
        } else {
            $('.page-builder__editable-area').removeClass('first-drop-is-done')
            $('.droppable-divider').remove()
        }
    }

    const _initAnchorReference = (that, target) => {
        const hrefInput =
            $(`<div class="anchor-ref">
                    <div class="input-wrapper">
                        <input placeholder="Link" class="anchor-ref__input" type="url">
                        <div class="confirm-btn"></div>
                    </div>
                </div>`)

        if ($(target).is('a, a input, .confirm-btn')) {
            if (that.children('.anchor-ref').length) return
            $('.anchor-ref').not(that).remove()
            that.append(hrefInput)

            that.find('.anchor-ref__input').val(that.closest('a').attr('href'))

            if ($(target).is(that)) return;
            $('.anchor-ref').remove()
        } else {
            $('.anchor-ref').remove()
        }
    }

    const _getInstaScript = () => {
        setTimeout(function () {
            $.getScript("//www.instagram.com/embed.js");
        }, 500)
    }

    const _initYouTubeEmbed = (that) => {
        const youtubeEmbed = that.prev().val()
        let videoId = youtubeEmbed.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }

        const video =
            $(`<div class="youtube-embed">
                            <div class="youtube-embed__layer" style="background: url('http://img.youtube.com/vi/${videoId}/hqdefault.jpg') no-repeat center"><div class="play-btn"></div></div>
                            <div class="youtube-embed__video-wrapper">
                                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen allow="autoplay"></iframe>
                            </div>
                        </div>`)

        that.closest('.embed-template__inner').hide()
        that.closest('.embed-template').append(video)
        _storeContent()
    };

    const _playYoutubeEmbed = (that) => {
        const layer = that.closest('.youtube-embed').find('.youtube-embed__layer')
        const videoWrapper = that.closest('.youtube-embed').find('.youtube-embed__video-wrapper')
        const video = that.closest('.youtube-embed').find('iframe')

        videoWrapper.addClass('is-playable')
        video.attr('src', video.attr('src') + '?autoplay=1')
        setTimeout(function () {
            layer.fadeOut()
        }, 250)
    }

    const _initInstaEmbed = (that) => {
        const instaEmbed = that.prev().val().replace(/<script.*<\/script>/, '')
        const instaTemplate = that.closest('.embed-template__inner')

        that.prev().trigger('change')
        that.closest('.template').addClass('is-loaded')
        instaTemplate.fadeOut().after(spinner)

        setTimeout(function () {
            instaTemplate.after(instaEmbed)
            instaTemplate.remove()
            window.instgrm.Embeds.process()
        }, 1000)

        const loadInstaEmbed = setInterval(() => {
            if ($('.instagram-media').height() <= 10) return
            $('.spinner').fadeOut(250, function () {
                $(this).remove()
                clearInterval(loadInstaEmbed)
                _storeContent()
            })
        }, 1000);
    }

    const _addEditableIds = () => {
        editorField.find('[data-editable]').each(function (i, elem) {
            const id = _createId(10)
            if ($(elem).attr('id')) return
            $(elem).attr('id', id)
        })
    }

    const _duplicateTemplate = (that) => {
        const currentEditor = that.closest('[data-editor]')
        const currentEditorId = currentEditor.find('[data-editable]').attr('id')
        const currentTemplate = that.closest('[data-template]')
        let createdId = _createId(10)

        tinymce.execCommand('mceRemoveEditor', true, currentEditorId)
        _destroyEditors()

        if (currentTemplate.is('[data-products]')) {
            currentTemplate.find('select').select2('destroy')
        }

        currentTemplate
            .next()
            .after(currentTemplate.clone(), $(dividerElem))
            .next()
            .children('.control-btns-wrapper').remove()

        const clonedTemplate = currentTemplate.next().next()

        _initEditor(currentEditorId, true)

        clonedTemplate
            .removeClass('is-selected')
            .find('[data-editable]').each(function () {
            $(this).removeAttr('id')
        })

        clonedTemplate.is(function (index, elem) {
            if ($(elem).is('[data-gallery]')) {
                $(this).find('.gallery-types__input-wrapper').each(function () {
                    const createInputId = _createId(10)
                    $(this).find('input').attr('id', createInputId)
                    $(this).find('label').attr('for', createInputId)
                })
                _makeSortable($(this).find(".gallery-img-list"), _countGalleryImages);
                if (!$(this).find('.gallery-preview').length) return
                $(this).find('.gallery-preview').remove()
            }
            if ($(elem).is('[data-form]')) {
                $(this).removeClass('form-options-is-hidden')
                $(this).find('form').removeClass('is-updated')
                $(this).find('.form-input').each(function () {
                    const createInputId = _createId(10)
                    $(this).find('input').attr({'id': createInputId, 'checked': false})
                    $(this).find('label').attr('for', createInputId)
                })
                $(this).find('.input-wrapper').each(function () {
                    $(this).remove()
                })
            }
            if ($(elem).is('[data-editor]')) {
                $(this).find('[data-editable]').each(function () {
                    $(this).attr('id', createdId)
                    const clonedEditorId = $(this).attr('id')
                    tinymce.execCommand('mceRemoveEditor', true, clonedEditorId)
                    _initEditor(clonedEditorId, true)
                })
            }
            if ($(elem).is('[data-products]')) {
                $(elem).find('.product-select').attr('id', _createId(10))
                $(elem).find('.product-cards-row').children().each(function () {
                    $(this).remove()
                })
                _initSelectInput(false, $(elem).find('select'))
            }
            if ($(elem).is('[data-layout]')) {
                $(this).find('[data-editor]').each(function () {
                    $(this).attr('id', createdId)
                    const clonedEditorId = $(this).attr('id')
                    tinymce.execCommand('mceRemoveEditor', true, clonedEditorId)
                    _initEditor(clonedEditorId, true)
                })
            }
        })
        _initSelectInput(true, undefined)
        _storeContent()
    }

    const _removeTemplate = (that) => {
        that.closest('[data-template]').fadeOut(300, function () {
            $(this).remove();
            _handleDropIcon()
            _handleLayouts()
            if ($('[data-template]').length !== 0) return
            firstDropIsDone = false
        }).next().remove();
        _storeContent();
    }

    const _debounce = (func, wait, immediate) => {
        let timeout;
        return function () {
            let context = this, args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    const _handleGalleryInputTypes = (that) => {
        const inputs = that.find('.gallery-types__inputs')

        if (that.find('.uploaded-file').length) {
            inputs.addClass('is-enabled')
        } else {
            inputs.removeClass('is-enabled')
            inputs.find('.gallery-type__input').each(function () {
                $(this).removeClass('type-is-selected')
            })
        }
    }

    const _handleFloatingLabels = () => {
        $('.uploaded-file textarea').each(function () {
            if ($(this).is(':focus')) {
                $(this).parent().addClass('is-active')
            } else if (!$(this).val().length) {
                $(this).parent().removeClass('is-active')
            }
        })
    }

    const _eventListeners = () => {
        $(document)
            .on('beforeSubmit', '#w0', function () {
                deletableFiles.forEach(function (key) {
                    _deleteRemovedFiles(key)
                    deletableFiles = []
                })
            })

            .on('click', '[data-anchor]', function (e) {
                e.preventDefault()
                _initAnchorReference($(this), e.target)
            })

            .on('mouseup drop click', function (e) {
                if (e.type === ('mouseup' || 'drop')) {
                    _drop().preview($(e.target));
                    _drop().template($(e.target));
                }
                if (e.type === 'click') {
                    _handleFloatingLabels()
                }
            })

            .on('mouseenter mouseover', '.template, .layout', function () {
                _selectTemplate($(this));
                _drag().template($(this))
            })

            .on('select2:select select2:unselect', '.product-select', function (e) {
                if (e.type === 'select2:select') {
                    _changeSelectedProduct($(this), e.params.data.id, false)
                    _initSelectInput(false, $(this))
                } else {
                    _changeSelectedProduct($(this), e.params.data.id, true)
                }
                _handleProductsPreviewBtn($(this).closest('[data-products]'))
                _storeContent()
            })

            .on('mouseover mouseenter click', '[data-editable]', function (e) {
                if (e.type === ('mouseover' || 'mouseenter')) {
                    _addEditableIds()

                    currentEditable = $(this).attr('id')

                    $('[data-editable]').each(function () {
                        const id = $(this).attr('id')
                        if (inactiveEditable.includes(id)) return
                        inactiveEditable.push(id)
                    })

                    if ($(this).hasClass('mce-content-body')) return
                    _initEditor(currentEditable, false)
                }

                if (e.type === 'click') {
                    inactiveEditable.filter(function (value) {
                        return value !== currentEditable
                    }).forEach(function (id) {
                        if ($(`#${id}`).closest('[data-editor]').length) return
                        tinymce.execCommand('mceRemoveEditor', true, id)
                    })
                    inactiveEditable = []
                }

            })

            .on('click', '.remove-template-btn', function () {
                _removeTemplate($(this))
            })

            .on('click', '.duplicate-template-btn', function () {
                _duplicateTemplate($(this))
            })

            .on('keyup', '[data-img-desc], [data-img-copyright], [data-img-caption]', _debounce(function () {
                $(this).text($(this).val())
                _storeContent()
            }, 250))

            .on('click', function (e) {
                const template = $('.template, .template *, .ck-balloon-panel');
                if (!template.is(e.target) && template.has(e.target).length === 0) {
                    _deselectTemplate($('[data-template]'), undefined, true)
                }

                if ($(e.target).is('a, a input, .confirm-btn')) return
                $('.anchor-ref').remove()
            })

            .on('keyup', '.insta-template-input', function () {
                if ($(this).val().match(/\<blockquote class="instagram-media".*\<\/blockquote\>/)) {
                    $(this).next().removeClass('is-disabled')
                } else {
                    $(this).next().addClass('is-disabled')
                }
            })

            .on('keyup', '.youtube-template-input', function () {
                if ($(this).val().match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)) {
                    $(this).next().removeClass('is-disabled')
                } else {
                    $(this).next().addClass('is-disabled')
                }
            })

            .on('click', '.page-builder__sidebar-tab', function () {
                $(this).addClass('active')
                $('.page-builder__sidebar-tab').not($(this)).removeClass('active')
                _handleTabs();
            })

            .on('click', '.page-builder__sidebar-hide-btn', function () {
                $('.page-builder').toggleClass('sidebar-is-hidden');
                _deselectTemplate(undefined, undefined, true)
            })

            .on('click mouseenter', '.delete-img-btn', function (e) {
                if (e.type === 'mouseenter') {
                    currentGallery = $(this).closest('[data-gallery]')
                }
                if (e.type === 'click') {
                    _handleDropArea($(this))
                    _removeUploadedFile($(this))
                    _countGalleryImages()
                    _handleGalleryInputTypes(currentGallery)
                }
            })

            .on('mouseenter mouseleave', '.uploaded-file', function (e) {
                if (e.type === 'mouseenter') {
                    _addDeleteImgBtn($(this))
                } else {
                    $('.delete-img-btn').remove()
                }
            })

            .on('click', '.anchor-ref .confirm-btn', function () {
                let inputValue = $(this).parent().find('.anchor-ref__input').val()

                $(this).parents('a').attr('href', inputValue)
                $(this).parents('.anchor-ref').remove()
                _storeContent()
            })

            .on('click', '.insta-embed-btn', function () {
                _initInstaEmbed($(this))
            })

            .on('click', '.youtube-embed-btn', function () {
                _initYouTubeEmbed($(this))
            })

            .on('dragover dragleave drop change', '.upload-drop-area input', function (e) {
                const file = this.files[0]
                const that = $(this)

                if (e.type === 'dragover') {
                    $(this).parent().addClass('is-droppable')
                } else if (e.type === 'dragleave') {
                    $(this).parent().removeClass('is-droppable')
                } else if (e.type === 'change') {
                    _upload(file, that, undefined);
                } else if (e.type === 'drop') {
                    const droppedFiles = (e.originalEvent.dataTransfer || e.dataTransfer).files;
                    _upload(droppedFiles[0], that, undefined)
                }

                e.preventDefault();
                e.stopPropagation();
            })

            .on('change drop dragover dragleave', '.gallery-drop-area__input', function (e) {
                const that = $(this)
                const files = this.files

                if (e.type === 'dragover') {
                    $(this).closest('.gallery-drop-area__inner-wrapper').addClass('is-droppable')
                } else if (e.type === 'dragleave') {
                    $(this).closest('.gallery-drop-area__inner-wrapper').removeClass('is-droppable')
                } else if (e.type === 'change') {
                    $.each(files, function (index, file) {
                        _upload(file, that, undefined);
                    });
                } else if (e.type === 'drop') {
                    const droppedFiles = (e.originalEvent.dataTransfer || e.dataTransfer).files;
                    $(this).closest('.gallery-drop-area__inner-wrapper').removeClass('is-droppable')

                    $.each(droppedFiles, function (index, file) {
                        _upload(file, that, droppedFiles);
                    });
                }
                _makeSortable($(".gallery-img-list"), _countGalleryImages)
                e.preventDefault();
                e.stopPropagation();
            })

            .on('paste', function (event) {
                //event.preventDefault();
                //let clipboarddata = window.event.clipboardData.getData('text');
            })

            .on('click', '.gallery-types__inputs input', function () {
                $(this).addClass('type-is-selected').css('opacity', 1)

                $(this).closest('.gallery-types__inputs').find('input')
                    .not($(this))
                    .removeClass('type-is-selected')

                $(this).closest('[data-gallery]').data('type', $(this).attr('id'))

                _storeContent()
            })

            .on('change', '.theme__input', function () {
                _setTheme($(this))
            })

            .on('change', '.form-input__option', function () {
                const activeForm = $(this).closest('[data-form]')
                const activeInputs = activeForm.find('.form-input__option:checked')

                $(this).attr('checked', true)
                if ($(this).is(':checked')) {
                    _addFormElement($(this))
                } else {
                    _removeFormElement($(this))
                }

                activeForm.find('.form-input__option').each(function () {
                    if (activeInputs.length) {
                        activeForm.addClass('is-updated')
                    } else {
                        activeForm.removeClass('is-updated')
                    }
                })
            })

            .on('click', '.youtube-embed .play-btn', function () {
                _playYoutubeEmbed($(this))
            })

            .on('click', '.gallery-type__label', function () {
                const that = $(this)
                //options.forEach(function (item) {
                //    if (item.template !== 'gallery') return
                //    loadedGalleryType = item.appearance.find(data => data.title == that.prev().data('title')).content
                //})
            })

            .on('click', '[data-gallery] .preview-template-btn', function () {
                _previewGalleryType($(this))
            })

            .on('click', '[data-form] .preview-template-btn', function () {
                $(this).closest('[data-form]').toggleClass('form-options-is-hidden');
                $(this).toggleClass('preview-is-active')
            })

            .on('click', '[data-products] .preview-template-btn', function () {
                _previewProductsTemplate($(this))
            })

            .on('click', '.gallery-type__input', function () {
                const previewBtn = $(this).closest('[data-gallery]').find('.preview-template-btn')

                if ($(this).is(':checked')) {
                    previewBtn.addClass('is-enabled')
                } else {
                    previewBtn.removeClass('is-enabled')
                }
            })

            .on('focus', '.uploaded-file textarea', function () {
                _handleFloatingLabels()
            })
    }

    const _disableGrammerly = () => {
        $('[data-editable], #tinymce').attr({
            'data-gramm': 'false',
            'data-gramm_editor': 'false',
            'data-enable-grammarly': 'false'
        })
    }

    const _destroyEditors = () => {
        $('[data-editable]').each(function () {
            if ($(this).parent().is('[data-editor]')) return
            tinymce.execCommand('mceRemoveEditor', true, $(this).attr('id'))
        })
    }

    const _storeContent = () => {
        setTimeout(function () {
            const _storeData = (data, store) => {
                data.find('[data-editable]').each(function () {
                    const contentType = $(this).data('content-type')
                    store[contentType] = $(this)[0].innerHTML
                })
                data.find('[data-image]').each(function () {
                    store.imageSrc = $(this).find('img').attr('src') || ''
                })
                data.find('[data-anchor]').each(function () {
                    store.anchorHref = $(this).attr('href') || ''
                })
                data.find('[data-file]').each(function () {
                    store.fileName = $(this).find("[data-content-type='file-name']").text() || ''
                    store.fileSize = $(this).find("[data-content-type='file-size']").text() || ''
                    store.fileHref = $(this).find(".uploaded-file__btn").attr('href') || ''
                })

                if (!data.is('[data-embed]')) return
                data.find('iframe').each(function () {
                    store.iframe = $(this)[0].outerHTML
                })
            }
            const templates = $('[data-template]');
            const themes = $('.theme__input')
            let templateObj = {'components': [], 'theme': ''};
            let toReturn;
            inactiveEditable = [];

            templates.each(function () {
                const that = $(this)
                const type = that.data('template-type')
                const content = that[0].outerHTML

                let template = {'data': {}, 'template-type': type, 'content': content}

                if (that.is('[data-gallery]')) {
                    let images = []
                    that.find('.uploaded-file').each(function () {
                        let image = {
                            src: $(this).find('img').attr('src') || '',
                            caption: $(this).find('[data-img-caption]').val() || '',
                            description: $(this).find('[data-img-desc]').val() || '',
                            copyright: $(this).find('[data-img-copyright]').val()
                        }

                        images.push(image)
                        template.data = images
                    })
                    that.find('.gallery-types__inputs input').each(function () {
                        if (!$(this).hasClass('type-is-selected')) return
                        template['type'] = $(this).data('title');
                    })
                }

                if (that.is('[data-form]')) {
                    let inputs = []
                    that.find('.form input, textarea').each(function () {
                        let input = {
                            type: $(this).attr('type'),
                            title: $(this).attr('placeholder'),
                            id: $(this).data('id')
                        }

                        if (input.type === 'hidden') return
                        inputs.push(input)
                        template.data.inputs = inputs
                    })
                }

                if (that.is('[data-editor]')) {
                    that.find('[data-editable]').each(function () {

                        const editorElem =
                            $(`<div class="template template-editor" data-editor data-template data-content-type="text">
                                        <div id='${$(this).attr('id')}' data-editable>${tinyMCE.get($(this).attr('id')).getContent({format: 'raw'})}</div>
                                        </div>`)[0].outerHTML

                        template['content'] = editorElem;
                    })
                }

                if (that.is('[data-products]')) {
                    let selectedProducts = []
                    that.find(':selected').each(function () {
                        selectedProducts.push($(this).data('title'))
                    })
                    template.data.selectedProducts = selectedProducts
                }
                if (that.is('[data-template-type="product"]')) {
                    let products = []
                    that.find('[data-product]').each(function () {
                        product = {}
                        _storeData($(this), product)
                        products.push(product)
                        template.data = products
                    })
                } else {
                    _storeData(that, template.data)
                }

                if (that.parents('[data-layout]').length) {
                    return toReturn;
                } else {
                    templateObj.components.push(template);
                }
            });

            themes.each(function () {
                if (!$(this).is(':checked')) return
                templateObj.theme = $(this).data('theme')
            })

            templateObj.components.forEach(function (obj) {
                let cleanedContent = $(obj.content)

                cleanedContent.filter(function (index, elem) {
                    $(elem).removeClass('is-selected')
                    $(elem).removeClass('preview-is-active')
                    $(elem).removeClass('controls-is-hidden')
                    $(elem).removeClass('form-options-is-hidden')
                    $(elem).find('[data-editable]').each(function () {
                        $(this).removeAttr('data-gramm data-gramm_editor data-enable-grammarly contenteditable spellcheck style data-focus-visible-added id').removeClass('mce-content-body mce-edit-focus focus-visible')
                        if (!$(this).next('input').length) return
                        $(this).next().remove()
                    })
                    $(elem).find('.product-cards-row').each(function () {
                        $(this).removeAttr('style')
                    })
                    $(elem).find('.products-template__controls').each(function () {
                        $(this).removeAttr('style')
                    })
                    $(elem).find('.uploaded-file').each(function () {
                        if ($(this).closest('[data-gallery]').length) return
                        $(this).css({'display': 'block', 'opacity': 1})
                    })
                    $(elem).find('.product-select').each(function () {
                        _destroySelect2($(this))
                    })
                    $(elem).find('.droppable-divider').each(function () {
                        $(this).remove()
                    })
                    $(elem).find('.gallery-preview').each(function () {
                        $(this).remove()
                    })
                    $(elem).find('.control-btns-wrapper').remove()
                })

                obj.content = cleanedContent[0].outerHTML
            })

            console.log(templateObj)
            contentStore.val(JSON.stringify(templateObj))
        }, 350)
    }

    const _retrieveContent = () => {
        if (contentStore.val() === '') return
        JSON.parse(contentStore.val()).components.forEach(function (item) {
            editorField.append(item.content)
            $('[data-sortable]').each(function () {
                _makeSortable($(this), undefined)
            })
            $('[data-products]').each(function () {
                if ($(item.content).find('select').attr('id') === $(this).find('select').attr('id')) {
                    const that = $(this)
                    let selected = []
                    item.data.selectedProducts.forEach(function (elem) {
                        that.find('option').each(function () {
                            if ($(this)[0].outerText === elem) {
                                selected.push($(this)[0].attributes.value.value)
                            }
                        })
                    })
                    _initSelectInput(false, $(this).find('select'))
                    setTimeout(function () {
                        that.find('select').val(selected).trigger('change')
                        _handleProductsPreviewBtn(that)
                    }, 250)
                }
            })

        })

        $('.theme__input').each(function () {
            let activeTheme = $(this).data('theme')

            if ($(this).data('theme') !== JSON.parse(contentStore.val()).theme) return
            $(this).attr('checked', true)

            editorField.attr('data-theme', activeTheme)
        })

        setTimeout(function () {

            $('.template').after(dividerElem).first().before(dividerElem)
            $('.anchor-ref, .delete-img-btn').remove()
            if ($('[data-editor]').length) {
                $('[data-editor]').each(function () {
                    $(this).find('[data-editable]').attr('id', _createId(10))
                    editorId = $(this).find('[data-editable]').attr('id')
                    _initEditor(editorId, true)
                })
            } else {
                $('[data-editable]').removeAttr('id')
            }
            _disableGrammerly()
            _addEditableIds()
            _removeDoubleDividers()
            _handleLayouts()
            _handleDropIcon()
            if (!$(".gallery-img-list").length) return
            _makeSortable($(".gallery-img-list"), _countGalleryImages)
        }, 500)
    }

    const _createId = (length) => {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    const _initEditor = (id, full) => {
        const template = {
            selector: `#${id}`,
            type: 'textarea',
            menubar: false,
            inline: !full,
            forced_root_block: false,
            convert_newlines_to_p: false,
            height: 250,
            convert_urls: true,
            relative_urls: false,
            remove_script_host: true,
            branding: false,
            paste_as_text: true,
            force_br_newlines: true,
            remove_linebreaks: false,
            valid_children: '+p[]',
            extended_valid_elements: 'p[*],li,ul,ol,div[*]',
            plugins: [
                'lists',
                'autolink',
                'powerpaste'
            ],
            toolbar: full ? 'undo redo styleselect bold italic alignleft aligncenter alignright alignjustify | bullist numlist outdent indent' : 'undo redo | bold italic underline',
            entity_encoding: 'raw',
            valid_elements: 'strong,em,span[style],a[href],br',
            valid_styles: {
                '*': 'font-size,font-family,color,text-decoration,text-align'
            },
            powerpaste_word_import: 'clean',
            powerpaste_html_import: 'clean',
            setup: function (ed) {
                ed.on('blur', function () {
                    _storeContent()
                });
                ed.on('change', _debounce(function () {
                    tinymce.triggerSave();
                    _storeContent()
                }, 250));
            },
        };
        tinymce.init(template)
    }

    const init = () => {
        _initSideBar()
        _initTabs()
        _retrieveContent()
        _getInstaScript()
        _eventListeners()
        _handleImgDropArea()
        _handleTabs()
        _drag().preview()
        _drop().preview()
        _removeDoubleDividers()
        _handleLayouts()
        _handleDropIcon()
    }

    return {
        init
    }
})();

$(document).ready(function () {
    app.init()
})