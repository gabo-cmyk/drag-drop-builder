<?php

namespace app\modules\builder\assets;

use app\assets\AssetBundle;

class ExternalAsset extends AssetBundle
{
    public $sourcePath = '@app/modules/builder_backup/assets/external';

    public $css = [];

    public $js = [
        'js/swiper-bundle.min.js',
    ];

    /**
     * @var array list of dependent asset bundles
     */
    public $depends = [
        'yii\web\JqueryAsset',
    ];
}
