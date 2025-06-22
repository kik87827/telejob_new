
window.addEventListener("DOMContentLoaded", () => {
    uiBase.init();
});

const uiBase = {
    init() {
        // 현재 객체 내의 모든 메서드 순회
        for (const key in this) {
            if (typeof this[key] === "function" && key !== "init") {
                this[key]();
            }
        }
    },
    commonInit() {
        let touchstart = "ontouchstart" in window;
        let userAgent = navigator.userAgent.toLowerCase();
        if (touchstart) {
            browserAdd("touchmode");
        }
        if (userAgent.indexOf("samsung") > -1) {
            browserAdd("samsung");
        }

        if (
            navigator.platform.indexOf("Win") > -1 ||
            navigator.platform.indexOf("win") > -1
        ) {
            browserAdd("window");
        }

        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            // iPad or iPhone
            browserAdd("ios");
        }

        function browserAdd(opt) {
            document.querySelector("html").classList.add(opt);
        }
    },
    navToggle() {
        const header_nav_toggle = document.querySelectorAll(".header_nav_toggle");
        if (!!header_nav_toggle) {
            header_nav_toggle.forEach((item) => {
                const thisItem = item;
                const thisTarget = thisItem.querySelector(".nav_toggle_target");
                thisTarget.addEventListener("click", (e) => {
                    e.preventDefault();
                    thisItem.classList.toggle("active");
                    e.stopPropagation();
                });
            });
            document.addEventListener("click", (e) => {
                header_nav_toggle.forEach((item) => {
                    const thisItem = item;
                    const toggleTarget = thisItem.querySelector(".nav_toggle_target");
                    if (!toggleTarget.contains(e.target)) {
                        item.classList.remove("active");
                    }
                });
            });
        }
    },
    searchKeyword() {
        const marquee = document.getElementById("keywordMarquee");
        if (!marquee) { return; }
        const content = marquee.querySelector(".top_search_keyword_list");

        // 텍스트 복제
        const clone = content.cloneNode(true);
        marquee.appendChild(clone);

        // 총 너비 계산
        const totalWidth = content.offsetWidth * 2 + 50;
        const speed = 100; // 픽셀당 이동 속도 (낮을수록 빠름)
        const duration = totalWidth / speed;

        // 애니메이션 시간 적용
        marquee.style.animationDuration = `${duration}s`;
    },
    searchForm() {
        const top_search_field = document.querySelector(".top_search_field");
        if (!top_search_field) { return; }
        const top_search_input = top_search_field.querySelector(".top_search_input");
        const btn_search_reset = top_search_field.querySelector(".btn_search_reset");
        let input_value_length = 0;
        if (!!top_search_input) {
            top_search_input.addEventListener("input", (e) => {
                input_value_length = e.target.value.length;
                top_search_field.classList.toggle("active",input_value_length)
            });
        }
        if (!!btn_search_reset) {
            btn_search_reset.addEventListener("click", (e) => {
                top_search_input.focus();
                top_search_field.classList.remove("active");
            });
        }
    },
    setVhProperty() {
        setProperty();
        window.addEventListener("resize", () => {
            setProperty();
        });
        function setProperty() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }
}


/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.touchstart = "ontouchstart" in window;
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");


    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          this.popupHide(this.selector);
        }, false);
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow() {
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) { return; }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    /* if (!!this.design_popup_wrap_active) {
      this.design_popup_wrap_active.forEach((element, index) => {
          if (this.design_popup_wrap_active !== this.selector) {
              element.classList.remove("active");
          }
      });
    } */
    this.layer_wrap_parent.append(this.selector);
    this.dimCheck();
  }
  popupHide(option) {
    let target = this.option.selector;
    let instance_option = option;
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      if ("beforeClose" in instance_option) {
        instance_option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      setTimeout(() => {
        this.selector.classList.remove("active");
        let closeTimer = 0;
        if(closeTimer){
          clearTimeout(closeTimer);
          closeTimer = 0;
        }else{
          if ("closeCallback" in this.option) {
            this.option.closeCallback();
          }
          closeTimer = setTimeout(()=>{
            if ("closeCallback" in instance_option) {
              instance_option.closeCallback();
            }
          },30);  
        }
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();
      
      
      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}


function designModal(option) {
  const modalGroupCreate = document.createElement("div");
  let domHtml = document.querySelector("html");
  let design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
  let modal_wrap_parent = null;
  let modal_item = null;
  let pagewrap = document.querySelector(".page_wrap");
  let showNum = 0;
  let okTextNode = option.okText ?? '확인';
  let cancelTextNode = option.cancelText ?? '취소';
  let closeBtnDisplay = option.closeDisplay ?? true;
  let submitBtnDisplay = option.submitDisplay ?? true;
  modalGroupCreate.classList.add("modal_wrap_parent");

  if (!modal_wrap_parent && !document.querySelector(".modal_wrap_parent")) {
    pagewrap.append(modalGroupCreate);
  } else {
    modalGroupCreate.remove();
  }
  modal_wrap_parent = document.querySelector(".modal_wrap_parent");

  let btnHTML = ``;

  if (option.modaltype === "confirm") {
    btnHTML = `
    <a href="javascript:;" class="btn_modal_submit cancelcall"><span class="btn_modal_submit_text">${cancelTextNode}</span></a>
    <a href="javascript:;" class="btn_modal_submit primary okcall"><span class="btn_modal_submit_text">${okTextNode}</span></a>
    `;
  } else {
    btnHTML = `
      <a href="javascript:;" class="btn_modal_submit primary okcall"><span class="btn_modal_submit_text">${okTextNode}</span></a>
    `;
  }
  

  let modal_template = `
    <div class="modal_wrap">
        <div class="bg_dim"></div>
        <div class="modal_box_tb">
            <div class="modal_box_td">
                <div class="modal_box_item">
                    <div class="modal_box_message_row">
                        <p class="modal_box_message">${option.message}</p>
                    </div>
                    <div class="btn_modal_submit_wrap">
                        ${btnHTML}
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
  modal_wrap_parent.innerHTML = modal_template;
  modal_item = modal_wrap_parent.querySelector(".modal_wrap");
  modal_item.classList.add("active");
  if (showNum) { clearTimeout(showNum); }
  showNum = setTimeout(() => {
    modal_item.classList.add("motion_end");
    modal_item.addEventListener("transitionend", (e) => {
      if (e.currentTarget.classList.contains("motion_end")) {
        if (option.showCallback) {
          option.showCallback();
        }
      }
    });
  }, 10);

  let btn_modal_submit_wrap = modal_item.querySelector(".btn_modal_submit_wrap");
  let btn_modal_submit = modal_item.querySelectorAll(".btn_modal_submit");
  let btn_modal_close = modal_item.querySelectorAll(".btn_modal_close");
  if(!submitBtnDisplay){
    modal_item.querySelector(".modal_box_item").classList.add("submit_not");
  }
  if (!!btn_modal_submit) {
    btn_modal_submit.forEach((item) => {
      let eventIs = false;

      if(!submitBtnDisplay){
        item.remove();
        btn_modal_submit_wrap.remove();
      }else{
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          let thisTarget = e.currentTarget;
          closeAction();
          if (thisTarget.classList.contains("okcall")) {
            if (option.okcallback) {
              option.okcallback();
            }
          } else if (thisTarget.classList.contains("cancelcall")) {
            if (option.cancelcallback) {
              option.cancelcallback();
            }
          }
          eventIs = true;
        });
      }

     
    });
  }
  if(!closeBtnDisplay){
    modal_item.querySelector(".modal_box_item").classList.add("close_not");
  }
  if(!!btn_modal_close){
    btn_modal_close.forEach((item)=>{
      let eventIs = false;
      if(!closeBtnDisplay){
        item.remove();
      }else{
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          closeAction();
          eventIs = true;
        });
      }
    })
  }

  function closeAction() {
    let actionNum = 0;
    modal_item.classList.remove("motion_end");
    if (design_popup_wrap_active.length === 0) {
      domHtml.classList.remove("touchDis");
    }
    if (actionNum) { clearTimeout(actionNum); }
    actionNum = setTimeout(() => {
      modal_item.classList.remove("active");
      modal_item.remove();
    }, 500);
  }
}
