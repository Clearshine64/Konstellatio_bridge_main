<template>
    <footer class="footer">
        <div class="footer__disclaimer">
            <img src="@/assets/img/disclaimer-arrow.svg" alt="" class="footer__disclaimer__img" />
            <p class="footer__disclaimer__text">disclaimer</p>
        </div>
        <p class="footer__copyright">© 2021 Konstellation. All rights reserved.</p>
        <div class="footer__links">
            <a href="#" class="footer__links__privacy">Privacy Policy</a>
            <a href="#" class="footer__links__terms">Terms & Conditions</a>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid $bluegrey;
    font-size: 14px;
    color: $grey;
    height: 100px;
    align-items: center;
    flex-shrink: 0;
    margin-top: 90px;
    position: relative;

    @media (max-width: 660px) {
        margin-top: 60px;
        flex-direction: column;
        padding: 30px;
        box-sizing: border-box;
        height: 140px;
    }

    &__copyright {
        @media (max-width: 660px) {
            margin-top: 40px;
        }
    }
    &__links {
        @media (max-width: 660px) {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        &__privacy {
            margin-right: 40px;
        }
    }
    &__disclaimer {
        position: absolute;
        top: -17px;
        left: 50%;
        transform: translateX(-50%);

        &__img {
            width: 34px;
            height: 34px;
            margin-bottom: 10px;
        }
        &__text {
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
    }
}
</style>
