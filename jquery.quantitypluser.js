/**
 * Jquery Плагин +- для input
 * Разработано в комании Prodvigaeff.ru Date: 14.03.2017 Time: 13:21
 * @name QuantityPluser
 * @copyright Prodvigaeff.ru <info@prodvigaeff.ru>
 * @author Большагин Вячеслав <gbublik@gmail.com>
 * @version 1.0
 */
(function ($) {
    /**
     * Настройки по умолчанию
     * @private
     */
    var _defaults = {
        after: 'after', //Имя css класса для плюса
        before: 'before', //Имя css класса для минуса
        step: 1, //Шаг
        max: null, //Максимальное колво
        min: 0, //Минимально
        callback: function(){console.log('default')}
    };
    /**
     * Методы плагина
     */
    var methods = {
        init: function (options) {
            this.options = $.extend({}, _defaults, options);
            return this.each($.proxy(_attacheHandlers, this));
        }
    };
    /**
     * Инициализирует обработчики
     * @param {int} index
     * @param {DOM} input
     * @private
     */
    var _attacheHandlers = function (index, input) {
        if (!$(input).data('qp'))
        {
            $(input).before('<button class="before">-</button>');
            $(input).after('<button class="after">+</button>');
            $(input).data('qp', true);
            if (!$(input).data('qpstep')) $(input).data('qpstep', this.options.step);
            if (!$(input).data('qpmax')) $(input).data('qpmax', this.options.max);
            if ($(input).data('qpmin') == undefined) $(input).data('qpmin', this.options.min);
        }

        $(input).parent().children('.' + this.options.after)
            .off('click', $.proxy(_Push, this))
            .on('click', $.proxy(_Push, this));
        $(input).parent().children('.' + this.options.before)
            .off('click', $.proxy(_Pull, this))
            .on('click', $.proxy(_Pull, this));
        $(input).on('change', $.proxy(_onChangeInput, this));

        _actualBtn(this, $(input));

        this.change = function (callback) {
            if (typeof callback == 'function') this.options.callback = callback;
        }
    };

    /**
     * Плюсуем
     * @param {Event} e
     * @private
     */
    var _Push = function(e)
    {
        var input = $(e.currentTarget).parent().children('input'),
            value = parseInt(input.val());
        if (input.data('qpmax') != null && ((value + input.data('qpstep')) > input.data('qpmax'))) input.val(input.data('qpmax'));
        else input.val(value + input.data('qpstep'));
        _actualBtn(this, input);
        this.options.callback.apply(this, [input.val()]);
    };

    /**
     * Минусуем
     * @param {Event} e
     * @private
     */
    var _Pull = function(e)
    {
        var input = $(e.currentTarget).parent().children('input'),
            value = parseInt(input.val());
        if (input.data('qpmin') != null && ((value - input.data('qpstep')) < input.data('qpmin'))) input.val(input.data('qpmin'));
        else input.val(value - input.data('qpstep'));
        _actualBtn(this, input);
        this.options.callback.apply(this, [input.val()]);
    };

    /**
     * Проверяет актуальность кнопки , если кнопка не актуальна отключает
     * @param $this
     * @param input
     * @private
     */
    var _actualBtn = function ($this, input, change)
    {
        var minus = input.parent().children('.' + $this.options.before),
            plus = input.parent().children('.' + $this.options.after),
            value = parseInt(input.val());
        if (input.data('qpmin') != null && value <= input.data('qpmin'))
        {
            if (change) input.val(input.data('qpmin'));
            minus.attr('disabled', true);
        }
        else minus.attr('disabled', false);
        if (input.data('qpmax') != null && value >= input.data('qpmax'))
        {
            if (change) input.val(input.data('qpmax'));
            plus.attr('disabled', true);
        }
        else plus.attr('disabled', false);
    };

    /**
     * Обработчки при ручном изменении в input
     * @param {Event} e
     * @private
     */
    var _onChangeInput = function (e)
    {
        _actualBtn(this, $(e.currentTarget), true);
        this.options.callback.apply(this, [$(e.currentTarget).val()]);
    }

    /**
     * Добавляет плагин в jquery
     * @param method
     * @returns {*}
     */
    $.fn.quantityPluser = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод "' + method + '" не найден в плагине jQuery.QuantityPluser');
        }
    };
})(jQuery);