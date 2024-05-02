const amazonpayAssist = (function () {
  return function (amazonPayButtonId, option) {
    const amazonPayButton = amazonPayButtonId
      ? amazonPayButtonId
      : 'AmazonPayButton';
    
    option = option || {};
    
    const optimization = {
      fontSize: function (styleJson) {
        if (!styleJson.fontSizeRatio) return styleJson;

        const maxFontSize = styleJson.maxFontSize ? styleJson.maxFontSize : 18;
        const windowWidth =
          window.innerWidth || document.documentElement.clientWidth || 0;
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight || 0;
        const minWidth = windowWidth < windowHeight
          ? windowWidth
          : windowHeight;
        if (minWidth === 0) {
          styleJson.fontSize = maxFontSize + 'px';
        } else {
          const fontSize = minWidth / styleJson.fontSizeRatio;
          styleJson.fontSize = fontSize < maxFontSize
            ? fontSize + 'px'
            : maxFontSize + 'px';
        }
        delete styleJson['fontSizeRatio'];
        delete styleJson['maxFontSize'];
        return styleJson;
      },
      width: function (styleJson) {
        if (!styleJson.landscapeWidth) return styleJson;

        const sp = window.matchMedia('(max-height: 450px)');
        styleJson.width = sp.matches
          ? styleJson.landscapeWidth
          : styleJson.width;
        delete styleJson['landscapeWidth'];
        return styleJson;
      },
    };

    function createNode(elem) {
      const element = elem.match(/polygon|svg/)
        ? document.createElementNS('http://www.w3.org/2000/svg', elem)
        : document.createElement(elem);
      element.styles = function (styleJson) {
        styleJson = optimization.fontSize(styleJson);
        styleJson = optimization.width(styleJson);
        Object.assign(element.style, styleJson);
        return element;
      };
      element.attrs = function (attrJson) {
        for (const attr in attrJson) {
          const value = attrJson[attr];
          if (/^on[A-Z]/.test(attr)) {
            const eventName = attr.slice(2).toLocaleLowerCase();
            element.addEventListener(eventName, value);
          } else {
            element.setAttribute(attr, value);
          }
        }
        return element;
      };
      element.parts = function (...appendElemArray) {
        if (appendElemArray && appendElemArray.length > 0) {
          for (const elem of appendElemArray) {
            element.appendChild(elem);
          }
        }
        return element;
      };
      element.text = function (str) {
        if (element.innerText !== undefined) {
          element.innerText = str;
        } else if (element.textContent !== undefined) {
          element.textContent = str;
        }
        return element;
      };
      return element;
    }
    const apayAssistStyles = {
      apayImgClass: {
        width: '100%',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '20px 0 0'
      },
      overlayClass: {
        visibility: 'hidden',
        opacity: '0',
      },
      wrapperClass: {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex: '100000',
      },
      windowClass: {
        position: 'fixed',
        zIndex: '100001',
      },
      closeButtonClass: {
        position: 'absolute',
        top: '-20px',
        right: '-15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#a8a8a8',
        borderRadius: '30px',
        width: '40px',
        height: '40px',
      },
      closeButtonSvgClass: {
        display: 'flex',
        alignItems: 'center',
        fill: '#fff',
        width: '16px',
        height: '16px',
      },
      contentClass: {
        width: '80vw',
        landscapeWidth: '80vh',
        maxWidth: '400px',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
        fontFamily: '"Helvetica Neue", "Helvetica", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Arial", "Yu Gothic", "Meiryo", sans-serif',
      },
      contentTitleClass: {
        lineHeight: '2',
        maxFontSize: '18',
        fontSizeRatio: '20',
        fontWeight: 'bold',
      },
      contentTitleTextClass: {
        textAlign: 'center',
        paddingTop: '10px',
      },
      contentBodyClass: {
        padding: '0 0 1px 0',
        textAlign: 'center',
      },
      contentBodyTextClass: {
        margin: '20px',
        maxFontSize: '16',
        fontSizeRatio: '30',
      },
      contentBoldClass: {
        color: 'orange',
      },
      subTextClass: {
        maxFontSize: '17',
        fontSizeRatio: '25',
        fontWeight: 'bold',
        position: 'relative',
        display: 'inline-block',
        marginBottom: '5px',
      },
      animationArrowClass: {
        content: '',
        width: '6px',
        height: '6px',
        border: '0',
        borderBottom: 'solid 2px #333',
        borderRight: 'solid 2px #333',
        position: 'absolute',
        top: '50%',
        marginTop: '-6px',
        transform: 'rotate(45deg)',
      },
      animationTextClass: {
        display: 'inline-block'
      },
      amznpayButtonClass: {
        margin: '0 15px 15px 15px',
        minHeight: '80px'
      },
      showClass: {
        visibility: 'visible',
        opacity: '1',
        transition: 'opacity 1000ms'
      },
      hideClass: {
        visibility: 'hidden',
        opacity: '0'
      }
    };
    // for style change
    Object.keys(option.styles || {}).forEach(function (styleClass) {
      apayAssistStyles[styleClass] = option.styles[styleClass];
    });

    const apayAssistHelper = (function (option) {

      const designstyles = {
        card: {
          countryType: {
            UK: {
              image: 'https://m.media-amazon.com/images/G/01/AmazonPay/BBAP-PaymentIssueGraphic-Corrected.svg',
              titleColor: '#0099d9',
              titleText: 'Would you like to use Amazon Pay instead?',
              buttonGuideText: 'Click the button below to order with your Amazon account.',
              contentText: [
                'You can pay using the information and payment methods from your Amazon account.',
                ''
              ] ,
            },
            US: {
             image: 'https://m.media-amazon.com/images/G/01/AmazonPay/BBAP-PaymentIssueGraphic-Corrected.svg',
              titleColor: '#0099d9',
              titleText: 'Would you like to use Amazon Pay instead?',
              buttonGuideText: 'Click the button below to order with your Amazon account.',
              contentText: [
                'You can pay using the information and payment methods from your Amazon account.',
                ''
              ] ,
            },
            DE: {
             image: 'https://m.media-amazon.com/images/G/01/AmazonPay/BBAP-PaymentIssue_DE.svg',
              titleColor: '#0099d9',
              titleText: 'Möchten Sie stattdessen Amazon Pay nutzen?',
              buttonGuideText: 'Klicken Sie auf den Amazon Pay-Button, um Ihre Bestellung abzuschließen.',
              contentText: [
                'Sie können mit den Informationen und Zahlungsarten aus Ihrem Amazon-Konto bezahlen.',
                ''
              ] ,
            },
            ES: {
             image: 'https://m.media-amazon.com/images/G/01/AmazonPay/BBAP-PaymentIssue_ES.svg',
              titleColor: '#0099d9',
              titleText: '¿Preferirías usar Amazon Pay?',
              buttonGuideText: 'Haz clic en el botón Amazon Pay para completar tu pedido.',
              contentText: [
                'Puedes pagar utilizando la información y los métodos de pago de tu cuenta de Amazon.',
                ''
              ] ,
            },
            FR: {
             image: 'https://m.media-amazon.com/images/G/01/AmazonPay/BBAP-PaymentIssue_FR.svg',
              titleColor: '#0099d9',
              titleText: 'Souhaitez-vous utiliser Amazon Pay ?',
              buttonGuideText: 'Cliquez sur le bouton Amazon Pay pour finaliser votre commande.',
              contentText: [
                'Vous pouvez payer en utilisant les informations et les moyens de paiement enregistrés sur votre compte Amazon.',
                ''
              ] ,
            },
            IT: {
             image: 'https://m.media-amazon.com/images/G/01/AmazonPay/BBAP-PaymentIssue_IT.svg',
              titleColor: '#0099d9',
              titleText: 'Vuoi usare Amazon Pay?',
              buttonGuideText: "Clicca sul pulsante Amazon Pay per completare l'ordine.",
              contentText: [
                'Puoi pagare usando le informazioni e i metodi di pagamento salvati nel tuo account Amazon.',
                ''
              ] ,
            }
          } 
        }
      };

      const typeText = option.type || 'form';
      const type = typeText.toLocaleLowerCase() in designstyles ? typeText.toLocaleLowerCase() : 'form';
      const countryText = option.country || 'US';
      const country = countryText.toLocaleUpperCase() in designstyles[type].countryType ? countryText.toLocaleUpperCase() : 'US';
      const design = designstyles[type];
      return {
        image: design.countryType[country].image,
        titleColor: design.countryType[country].titleColor,
        titleText: design.countryType[country].titleText,
        contentText: design.countryType[country].contentText,
        buttonGuideText: design.countryType[country].buttonGuideText
      }
    })(option);

    const closeButtonNode = createNode('div')
      .styles(apayAssistStyles.closeButtonClass)
      .attrs({
        onClick: function () {
          this.style.background = '#00a4b4';
          overlay.hide();
        },
        onMouseover: function () {
          this.style.background = '#5E6A78';
        },
        onMouseout: function () {
          this.style.background = '#a8a8a8';
        },
      })
      .parts(
        createNode('svg').styles(apayAssistStyles.closeButtonSvgClass).parts(
          createNode('polygon').attrs({
            points: '14.4,3.1 12.9,1.6 8,6.6 3.1,1.6 1.6,3.1 6.6,8 1.6,12.9 3.1,14.4 8,9.4 12.9,14.4 14.4,12.9 9.4,8',
          })
        )
      );

    const apayImgNode = createNode('div').parts(
      createNode('img')
        .styles(apayAssistStyles.apayImgClass)
        .attrs({
          src: apayAssistHelper.image,
          alt: 'Amazon Pay Image',
        }));

    const contentTitleNode = createNode('div')
      .styles(apayAssistStyles.contentTitleClass)
      .parts(
        createNode('div').styles({ ...apayAssistStyles.contentTitleTextClass, 'color': apayAssistHelper.titleColor }).text(apayAssistHelper.titleText),
      );

    const animationNode = (function () {
      return {
        arrow: function (direction) {
          return _animate(
            createNode('span').styles({ ...apayAssistStyles.animationArrowClass, [direction]: '-15px' }),
            ['translateY(0) rotate(45deg)', 'translateY(5px) rotate(45deg)', 'translateY(0) rotate(45deg)']
          );
        },
        text: function (text) {
          return _animate(
            createNode('span').styles(apayAssistStyles.animationTextClass).text(text),
            ['translateY(0)', 'translateY(5px)', 'translateY(0)']
          )
        }
      }

      function _animate(elem, transform) {
        elem.animate({
          transform: transform,
          easing: ['ease-in-out']
        }, {
          duration: 1000000,
          iterations: Infinity,
        });
        return elem;
      }
    })();

    const contentBodyNode = createNode('div')
      .styles(apayAssistStyles.contentBodyClass)
      .parts(
        createNode('div')
          .styles(apayAssistStyles.contentBodyTextClass)
          .parts(
            ...apayAssistHelper.contentText.map(function (text) {
              return createNode('div').styles({marginBottom: '5px'}).text(text)
            })
          ),
        createNode('div').parts(
          createNode('div')
            .styles(apayAssistStyles.subTextClass)
            .parts(
              //animationNode.arrow('left'),
              animationNode.text(apayAssistHelper.buttonGuideText),
              //animationNode.arrow('right'),
            ),
          createNode('div')
            .attrs({ id: amazonPayButton })
            .styles(apayAssistStyles.amznpayButtonClass)
        )
      );

    /* for popup html creation */
    (option.append || document.body).appendChild(
      createNode('div')
        .attrs({ id: 'amazonpayAssist' })
        .styles(apayAssistStyles.overlayClass)
        .parts(
          createNode('div')
            .styles(apayAssistStyles.wrapperClass)
            .parts(
              createNode('div')
                .styles(apayAssistStyles.windowClass)
                .parts(
                  closeButtonNode,
                  createNode('div')
                    .styles(apayAssistStyles.contentClass)
                    .parts(
                      createNode('div').parts(
                        apayImgNode,
                        contentTitleNode,
                        contentBodyNode
                      )
                    )
                )
            )
        )
    );

    /* popup display logic */
    const overlay = (function () {
      let elem = document.getElementById('amazonpayAssist');
      let displayed = false;
      let isRequiredFilled = function (requiredClazz) {
        let fields = document.getElementsByClassName(requiredClazz);
        for (let i = 0; i < fields.length; i++) {
          if (!(fields[i].type === 'hidden' || fields[i].value)) return false;
        }
        return true;
      };
      return {
        show: function (requiredClazz) {
          if (displayed) return;
          if (requiredClazz && isRequiredFilled(requiredClazz)) return;
          document.activeElement.blur();
          elem.setAttribute('style',
            Object.keys(apayAssistStyles.showClass).map(function (key) {
              return [key, apayAssistStyles.showClass[key]].join(':')
            }).join(';')
          );
          displayed = true;
        },
        hide: function () {
          elem.setAttribute('style',
            Object.keys(apayAssistStyles.hideClass).map(function (key) {
              return [key, apayAssistStyles.hideClass[key]].join(':')
            }).join(';')
          );
        },
      };
    })();
    const inputfields = (function () {
      let changedTime = Date.now();
      return {
        monitor: function (fields) {
          for (let i = 0; i < fields.length; i++) {
            ['keydown', 'change', 'focus'].forEach(function (event) {
              fields[i].addEventListener(
                event,
                function () {
                  changedTime = Date.now();
                },
                false
              );
            });
          }
        },
        fillInAll: function (fields) {
          for (let i = 0; i < fields.length; i++) {
            if (!fields[i].value) return false;
          }
          return true;
        },
        changed: function (time) {
          return Date.now() - changedTime < time * 1000;
        },
      };
    })();
    let requiredClazz = null;
    return {
      // Display popup after showing the page (after specified seconds)
      fadeIn: function (durationSec) {
        setTimeout(function () {
          overlay.show(requiredClazz);
        }, durationSec * 1000);
        return this;
      },
      // Display Mouse cursor leave from the page
      mouseLeave: function () {
        document.body.addEventListener(
          'mouseleave',
          function () {
            overlay.show(requiredClazz);
          },
          false
        );
        return this;
      },
      // Display when there is no input within the specified seconds
      onInactive: function (durationSec, className) {
        let fields = document.getElementsByClassName(className);
        inputfields.monitor(fields);
        const interval = setInterval(function () {
          if (inputfields.fillInAll(fields)) {
            clearInterval(interval);
            return;
          }
          if (!inputfields.changed(durationSec)) {
            overlay.show(requiredClazz);
            clearInterval(interval);
          }
        }, 1000);
        return this;
      },
      notShow: function (localRequiredClazz) {
        requiredClazz = localRequiredClazz;
        return this;
      },
    };
  };
})();
