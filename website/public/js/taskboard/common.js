/**
 * Function makes qTip2 tooltip for specified element. Note that this tooltip can contain
 * desired HTML structure which is shown as tooltip.
 *
 * Below is example HTML structure of usage:
 *
 *  <icon class="icon icon-help tooltipDiv">
 *      <div class="tooltipDivContainer">
 *          <h1>Tooltip title</h1>
 *          <div>
 *              Your <em>tooltip</em> content <strong>here</strong>
 *          </div>
 *      </div>
 *  </icon>
 *
 *  And in your CSS definitions add following:
 *
 *  .tooltipDivContainer {
 *      display: none;
 *  }
 *
 * @param   {jQuery|$}  element
 */
function createQtipDiv(element) {
    var title = element.find(".tooltipDivContainer h1").clone().html();
    var content = _.unescape(element.find(".tooltipDivContainer div").clone().html());

    // Create actual tooltip
    createQtip(element, title, content, "auto", "top left", "bottom center", true, 50);
}

/**
 * Function makes simple qTip2 tooltip for specified element.
 *
 * Below is example HTML structure of usage:
 *
 *  <a href="#" class="tooltipTitle" title="Your tooltip here">click me</a>
 *
 * @param   {jQuery|$}  element
 */
function createQtipTitle(element) {
    var title = "";
    var content = element.attr("title");

    // Create actual tooltip
    createQtip(element, title, content, "auto", "top left", "bottom center", false, 50);
}

/**
 * Function creates actual qTip2 for specified element.
 *
 * @param   {jQuery|$}      element
 * @param   {String}        tipTitle
 * @param   {String}        tipText
 * @param   {String|Number} tipWidth
 * @param   {String}        tipMy
 * @param   {String}        tipAt
 * @param   {Boolean}       tipFixed
 * @param   {Number}        tipDelay
 */
function createQtip(element, tipTitle, tipText, tipWidth, tipMy, tipAt, tipFixed, tipDelay) {
    element.qtip({
        metadata: {
            type: "html5",      // Use HTML5 data-* attributes
            name: "qtipOptions" // Grab the metadata from the data-qtip-options HTML5 attribute
        },
        content: {
            title: tipTitle,
            text: tipText
        },
        style: {
            tip: {
                corner: true
            },
            classes: "qtip-bootstrap",
            width: tipWidth
        },
        show: {
            ready: true,
            solo: true,
            delay: 40
        },
        hide: {
            fixed: tipFixed,
            delay: tipDelay,
            effect: false
        },
        position: {
            my: tipMy,
            at: tipAt,
            viewport: jQuery(window),
            container: jQuery("body")
        },
        events: {
            hide: function(event, api) {
               element.qtip("destroy");
            }
        }
    });
}

/**
 * Function makes specified noty message.
 *
 * @param   {String}    text        Message to show
 * @param   {String}    [type]      Type of message
 * @param   {{}}        [options]   Custom options for noty
 */
function makeMessage(text, type, options) {
    type = type || "success";
    options = options || {};

    var timeout = 6000;

    switch (type) {
        case "success":
            timeout = 3000;
            break;
    }

    // Create noty
    noty(jQuery.extend({}, {
        text: text.nl2br(),
        type: type,
        layout: "top",
        timeout: timeout
    }, options));
}

/**
 * Generic javascript "job" dispatcher.
 *
 * @returns {*}
 */
function dispatch(fn, args) {
    // Allow fn to be a function object or the name of a global function
    fn = (typeof fn == "function") ? fn : window[fn];

    // args is optional, use an empty array by default
    return fn.apply(this, args || []);
}

/**
 * Function creates a Bootbox modal dialog with specified title, content and buttons.
 *
 * @param   {String}                title       Modal title
 * @param   {String}                content     Modal content as html
 * @param   {Object|Array|Null}     buttons     Button(s) to add dialog
 * @param   {
 *          String|
 *          Boolean|
 *
 * @returns {jQuery|$}
 */
function createBootboxDialog(title, content, buttons) {

    var buttonsToShow = [];

    // Every dialog has close button.
    buttonsToShow.push({
        label: "Close",
        className: "btn btn-default pull-left",
        callback: function() {
            
        }
    });

    // We have multiple buttons
    if (buttons instanceof Array) {
        jQuery.each(buttons, function(index, button) {
            buttonsToShow.push(button);
        });
    } else if (buttons !== null) { // Just one button to add
        buttonsToShow.push(buttons);
    }

    // Create bootbox modal
    var modal = bootbox.dialog({
        message: content,
        title: title,
        buttons: buttonsToShow,
        show: false,
        onEscape: function() {
            modal.modal("hide");
        }
    });

    // Generic modal init
    modal.on("shown.bs.modal", function() {
        //initWysiwyg(modal);     // Initialize wysiwyg for textarea inputs
        initSelect(modal);      // Initialize select list
        //initTooltips(modal);    // Initialize possible modal context tooltips
        initDropDown(modal);    // Initialize dropdown menus
        initTabs(modal);        // Initialize tabs
        initActionMenu(modal);  // Initialize custom action menus

        //initMultiSelect(modal);
        var header = modal.find(".modal-header");
        var body = modal.find(".modal-body");
        var footer = modal.find(".modal-footer");

        var height = jQuery(window).height() - header.height() - footer.height() - 90;

        body.css("max-height", height);
        body.width(body.width() - 2);
    });

    // Generic modal hide event handler
    modal.on("hide.bs.modal", function() {
        // This will fix select box show problem
        jQuery("body").find("div.bootstrap-select.form-control.in-modal").each(function() {
            jQuery(this).hide();
        });
    });    
    // Return bootbox dialog
    return modal;
}

/**
 * Function to set specified cookie and value for given days.
 *
 * @param   {String}        name    Name of the cookie
 * @param   {String|Number} value   Cookie value
 * @param   {Number}        days    How many days cookie is valid
 */
function createCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        expires = "; expires=" + date.toGMTString();
    }

    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

/**
 * Function to read specified cookie.
 *
 * @param   {String}    name     Name of the cookie
 *
 * @returns {String|Number|Null}
 */
function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) == 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }

    return null;
}

/**
 * Function to erase specified cookie.
 *
 * @param   {String}    name     Name of the cookie
 */
function eraseCookie(name) {
    createCookie(name, "", -1);
}

/**
 * Function fetches CSRF token from sails.js server for AJAX and socket
 * requests. Token is fetched from server via simple request, note that
 * this call is not async.
 *
 * @returns {String}    CSRF token
 */
function getCsrfToken() {
    // Make AJAX call to fetch valid CSRF token
    var response = jQuery.parseJSON(
        jQuery.ajax({
            async: false,
            type: "GET",
            dataType: "json",
            url: "/csrfToken"
        }).responseText
    );

    return response._csrf;
}