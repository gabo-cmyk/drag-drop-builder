<?php

/* @var \yii\web\View $this */
/* @var \app\modules\builder\assets\BuilderAsset $builderAsset */

?>
<div class="template product-template" data-template="7" data-template-type="product">
    <div class="row align-items-center" data-product>
        <div class="col-lg-5 product-template__left">
            <div class="upload-drop-area is-empty">
                <input type="file" required name="fileName" data-image accept="image/*"/>
            </div>
        </div>
        <div class="col-lg-7 product-template__right">
            <div class="d-flex flex-column">
                <span class="product-template__title mb-0" data-editable data-content-type="title">Max Factor</span>
                <span class="product-template__price" data-editable data-price data-content-type="price">3860 Ft</span>
                <a href="/site/latest" class="primary-btn mb-4" data-anchor>
                    <span data-editable data-content-type="btn">Vásárlás</span>
                    <?= file_get_contents($builderAsset->basePath . '/images/icons/arrow_right_icon.svg') ?>
                </a>
            </div>
            <p data-editable data-content-type="desc">
                Az animációs filmek közül az Encanto, a Menekülés, a Luca, A Mitchellék a gépek ellen, valamint a Raya
                és az
                utolsó sárkány szerepel az Oscar-jelöltek listáján. A nemzetközi film-kategória öt jelöltje: a japán
                Drive
            </p>
        </div>
    </div>
</div>


