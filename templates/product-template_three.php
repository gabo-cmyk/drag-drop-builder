<?php

/* @var \yii\web\View $this */
/* @var \app\modules\builder\assets\BuilderAsset $builderAsset */

?>
<div class="template product-template" data-template="8" data-template-type="product">
    <div class="row align-items-center">
        <div class="col-md-4 pl-2" data-product>
            <div class="d-flex flex-column">
                <div class="upload-drop-area is-empty">
                    <input type="file" required name="fileName" data-image accept="image/*"/>
                </div>
                <span class="product-template__title" data-editable data-content-type="title">Max Factor</span>
                <span class="product-template__desc" data-editable data-content-type="desc">False Lash Effect vízálló szempillaspirál a dús és szétválasztott pillákért</span>
                <span class="product-template__price" data-editable data-content-type="price">3860 Ft</span>
                <a href="" class="primary-btn" data-anchor>
                    <span data-editable data-content-type="btn">Vásárlás</span>
                    <?= file_get_contents($builderAsset->basePath . '/images/icons/arrow_right_icon.svg') ?>
                </a>
            </div>
        </div>
        <div class="col-md-4" data-product>
            <div class="d-flex flex-column">
                <div class="upload-drop-area is-empty">
                    <input type="file" required name="fileName" data-image accept="image/*"/>
                </div>
                <span class="product-template__title" data-editable data-content-type="title">Max Factor</span>
                <span class="product-template__desc" data-editable data-content-type="desc">False Lash Effect vízálló szempillaspirál a dús és szétválasztott pillákért</span>
                <span class="product-template__price" data-editable data-content-type="price">3860 Ft</span>
                <a href="" class="primary-btn" data-anchor>
                    <span data-editable data-content-type="btn">Vásárlás</span>
                    <?= file_get_contents($builderAsset->basePath . '/images/icons/arrow_right_icon.svg') ?>
                </a>
            </div>
        </div>
        <div class="col-md-4 pl-2" data-product>
            <div class="d-flex flex-column">
                <div class="upload-drop-area is-empty">
                    <input type="file" required name="fileName" data-image accept="image/*"/>
                </div>
                <span class="product-template__title" data-editable data-content-type="title">Max Factor</span>
                <span class="product-template__desc" data-editable data-content-type="desc">False Lash Effect vízálló szempillaspirál a dús és szétválasztott pillákért</span>
                <span class="product-template__price" data-editable data-content-type="price">3860 Ft</span>
                <a href="" class="primary-btn" data-anchor>
                    <span data-editable data-content-type="btn">Vásárlás</span>
                    <?= file_get_contents($builderAsset->basePath . '/images/icons/arrow_right_icon.svg') ?>
                </a>
            </div>
        </div>
    </div>
</div>


