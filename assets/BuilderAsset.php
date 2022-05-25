<?php

namespace app\modules\builder\assets;

use app\assets\AssetBundle;

class BuilderAsset extends AssetBundle
{
    public $devPath = '@app/modules/builder_backup/assets/main/src';
    public $distPath = '@app/modules/builder_backup/assets/main/dist';

    public $devJs = [
        'js/builder_backup.min.js' => [
            'js/builder_backup.js',
        ],
    ];

    /**
     * @var string relative path to images
     *
     * Images in this directory will be optimized and copied to the production path
     * by the build process
     */
    public $imgPath = 'images';

    public $scssPath = 'scss';

    public $css = [
        'css/editor.scss',
        'css/buttons.scss',
        'css/inputs.scss',
        'css/builder_backup.scss',
        'css/variables.scss',
        'css/templates.scss',
        'css/layouts.scss',
        'css/themes.scss',
        'css/swiper.scss',
    ];

    public $js = [
        'js/builder_backup.min.js',
    ];

    public $depends = [
        'app\modules\builder\assets\ExternalAsset',
        'app\modules\builder\assets\TinyMceAsset',
        'yii\web\JqueryAsset',
        'yii\web\YiiAsset',
    ];
}
