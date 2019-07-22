var mySwiper = new Swiper ('.swiper-container', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 3,
    allowTouchMove: false,
    breakpoints: {
      767: {
        slidesPerView: 1, 
        allowTouchMove: true,     
      },
      1024: {
        slidesPerView: 2,
      },

    }
  })

