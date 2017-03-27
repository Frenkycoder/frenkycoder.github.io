//one page scroll
$(function() {

    var sections = $('.section'),
        display = $('.maincontent'),
        inScroll = false;

    var scrollToSection = function(sectionEq) {
        var position = 0;
        if (!inScroll) {
            inScroll = true;

            position = (sections.eq(sectionEq).index() * -100) + '%'; // запитати, навіщо додавaти метод index() ?

            sections.eq(sectionEq).addClass('active')
                .siblings().removeClass('active');
            display.css({
                'transform': 'translate3d(0, ' + position + ', 0)'
            });

            setTimeout(function() {
                inScroll = false;

                $('.fixed-menu__item').eq(sectionEq).addClass('active').
                siblings().removeClass('active');
            }, 1300)
        }

    };




    $('.wrapper').on('wheel', function(e) {
        //e - аргумент, у якому містяться дані про подію
        var deltaY = e.originalEvent.deltaY,
            activeSection = sections.filter('.active'),
            nextSection = activeSection.next(),
            prevSection = activeSection.prev();


        if (deltaY > 0) { //то скролим вниз
            if (nextSection.length) {
                scrollToSection(nextSection.index());
            }
        }

        if (deltaY < 0) { //то скролим вверх
            if (prevSection.length) {
                scrollToSection(prevSection.index());
            }
        }




    });

    $('.down-arrow').on('click', function(e) {
        e.preventDefault();

        scrollToSection(1);
    })

    $('.fixed-menu__link, .nav__link, .order-link').on('click', function(e) {
        e.preventDefault();

        var href = parseInt($(this).attr('href'));

        scrollToSection(href);
    });

    $(document).on('keydown', function(e) {
        var activeSection = sections.filter('.active'),
            nextSection = activeSection.next(),
            prevSection = activeSection.prev();
        switch (e.keyCode) {
            case 40: //листаем вниз
                if (nextSection.length) {
                    scrollToSection(nextSection.index());
                }
                break;
            case 38: //листаем вверх
                if (prevSection.length) {
                    scrollToSection(prevSection.index());
                }
                break;
        }
    });
});

//slider
$(function() {
    var burgerCarousel = $('.burgers-slider').owlCarousel({
        items: 1,
        loop: true,
        smartSpeed: 1500
    });

    $('.burger-slider__btn_next').on('click', function(e) {
        e.preventDefault();

        burgerCarousel.trigger('next.owl.carousel');
    });

    $('.burger-slider__btn_prev').on('click', function(e) {
        e.preventDefault();

        burgerCarousel.trigger('prev.owl.carousel');
    });
});

//vertical accordeon
$(function() {
    $('.team-acco__trigger').on('click', function(e) {
        e.preventDefault();

        var $this = $(this),
            item = $this.closest('.team-acco__item'),
            container = $this.closest('.team-acco'),
            items = container.find('.team-acco__item'),
            content = item.find('.team-acco__content'),
            otherContent = container.find('.team-acco__content');



        if (!item.hasClass('active')) {
            items.removeClass('active');
            item.addClass('active');
            otherContent.stop().slideUp();
            content.stop().slideDown();
        } else {
            item.removeClass('active');
            content.stop().slideUp();
        }
    });
});


//horizontal acco

$(function() {
    $('.menu-acco__trigger').on('click', function(e) {
        e.preventDefault();
        var $this = $(this),
            container = $this.closest('.menu-acco'),
            item = $this.closest('.menu-acco__item'),
            items = container.find('.menu-acco__item'),
            activeItem = items.filter('.active'),
            content = item.find('.menu-acco__content'),
            activeContent = activeItem.find('.menu-acco__content');

        if (!item.hasClass('active')) {

            items.removeClass('active');
            item.addClass('active');

            activeContent.animate({
                'width': '0px'
            });

            content.animate({
                'width': '550px'
            });
        } else {
            item.removeClass('active');
            content.animate({
                'width': '0px'
            });
        }
    });

    $(document).on('click', function(e) {
        var $this = $(e.target);

        if (!$this.closest('.menu-acco').length) {
            $('.menu-acco__content').animate({
                'width': '0px'
            });
            $('.menu-acco__item').removeClass('active');
        }
    });
});

//input mask
$(function() {
    $('.phone-mask').inputmask('+7 (999) 999 99 99');
});

//fancybox
$(function() {
    $('.review__view').fancybox({
        type: 'inline',
        maxWidth: 460,
        fitToView: false,
        padding: 0
    });

    $('.full-review__close').on('click', function(e) {
        e.preventDefault();

        $.fancybox.close();
    });
});

//form submit
function valid() {
    var regempty = new RegExp('([^\\s*]+)'),
        regmail = new RegExp("/^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i"),
        checkform = true;
    var sendform = function(elem) {
        formData = elem.serialize();
        $.ajax({
            url: 'mail.php',
            type: 'POST',
            data: formData,
            success: function(data) {
                var popup = data.status ? '#success' : '#error';
                $.fancybox.open([
                    { href: popup }
                ], {
                    type: 'inline',
                    maxWidth: 250,
                    fitToView: false,
                    padding: 0,
                    afterClose: function() {
                        elem.trigger('reset');
                    }
                });
            }
        });
    };
    var checkdata = function(elem) {
            // 6. Принимаем каждый инпут или техтареа
            // console.log("checkdata");
            //7.Свитчем получаем атрибут инпута или техтареа, и вызываем соотвествующую функцию на проверку этого поля
            switch ($(elem).attr("type")) {
                case 'email':
                    return checkmail(elem); // 8 функция возвращает true или false после проверки на регулярку
                    break;

                default: //Если тип инпута не совпал с вышепереисленными, сработает функция ниже
                    return checkother(elem); // 8 функция возвращает true или false после проверки на регулярку
            }
        },
        checkmail = function(elem) {
            if (!regmail.test(elem.value)) { //Если инпут не прошел валидацию
                showtooltip(elem); // Отображает ошибку вызвав метод showtooltip
                return false; // возвращаем false - что значит есть ошибка.
            } else {
                return true; //если проверка на регулярное выраженеи прошло успешно, значит инпут заполнен
            }
        },

        checkother = function(elem) {
            if (!regempty.test(elem.value)) {
                showtooltip(elem);
                return false;
            } else {
                return true;
            }
        },
        showtooltip = function(elem) {

            // console.log(elem);
            $(elem).qtip({ // Grab some elements to apply the tooltip to
                content: {
                    text: $(elem).attr("data-error")
                },
                show: {
                    event: event.type, // Use the same show event as the one that triggered the event handler
                    ready: true // Show the tooltip as soon as it's bound, vital so it shows up the first time you hover!
                },
                hide: {
                    // target: $(".to__index, .button__link, input[type='reset']") // Defaults to target element
                    // event: false, // Hide on mouse out by default
                    // effect: true, // Use default 90ms fade effect
                    // delay: 0, // No hide delay by default
                    // fixed: false, // Non-hoverable by default
                    // inactive: false, // Do not hide when inactive
                    // leave: false, // Hide when we leave the window
                    // distance: false // Don't hide after a set distance
                },
                position: {
                    my: 'top center',
                    at: 'center center'
                },
                style: {
                    classes: 'mytip mytip-red'
                }
            })
        };
    return {
        init: function(elem) {
            console.log("module init");
            var data = elem.find("input, textarea"); // 3. В форме ищем input, и textarea

            $.each(data, function(val, key) { //4.Каждый инпут или техтареа в массиве data перебираем
                //5.Вызываем функию checkdata и передаем в нее каждый инпут или каждый textarea
                if (checkdata(key) == false) { //9 Функция checkdata по каждому инпуту или textarea возвращает true/false и соответсвенно проверяем
                    checkform = false; //Тогда форма не проходит валидиацию
                }
                if (checkform == true) {
                    $.each($(".qtip"), function(val, key) {
                        $(this).hide();
                    });
                    sendform(elem);
                }
            });
        }
    }
}
$(document).ready(function() {
    // 1. Отлавливаем отправку формы
    $("#order-form").on("submit", function(e) {
        e.preventDefault();
        //2.Передаем форму в функцию валидацию, в метод init
        valid().init($(this));
    })
    $('.status-popup__close').on('click', function(e) {
        e.preventDefault();
        $.fancybox.close();

    });
});




//yandex map
$(function() {
    ymaps.ready(init);
    var myMap;

    function init() {
        myMap = new ymaps.Map("map", {
            center: [59.91817154482064, 30.30557799999997],
            zoom: 11,
            controls: []
        });

        var coords = [
                [59.94554327989287, 30.38935262114668],
                [59.91142323563909, 30.50024587065841],
                [59.88693161784606, 30.319658102103713],
                [59.97033574821672, 30.315194906302924]
            ],
            myCollection = new ymaps.GeoObjectCollection({}, {

                draggable: false,
                iconLayout: 'default#image',
                iconImageHref: 'img/icons/map-marker.svg',
                iconImageSize: [46, 57],
                iconImageOffset: [-26, -52]
            });

        for (var i = 0; i < coords.length; i++) {
            myCollection.add(new ymaps.Placemark(coords[i]));
        }

        myMap.geoObjects.add(myCollection);
        myMap.behaviors.disable('scrollZoom');
    }
});
