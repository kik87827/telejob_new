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

    if (navigator.platform.indexOf("Win") > -1 || navigator.platform.indexOf("win") > -1) {
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
    if (!marquee) return;

    const content = marquee.querySelector(".top_search_keyword_list");

    // 텍스트 복제 (한 번만 실행되게 처리)
    const clone = content.cloneNode(true);
    marquee.appendChild(clone);

    function isPC() {
      // PC인지 확인 (필요에 따라 조건 조절 가능)
      return window.innerWidth >= 1024;
    }

    function action() {
      if (!isPC()) return; // 모바일일 경우 실행 안 함

      const contentWidth = content.offsetWidth;

      // 모바일에서 display: none이면 offsetWidth가 0이 되어 오류 발생
      if (contentWidth === 0) {
        console.warn("콘텐츠 너비가 0입니다. action() 실행 보류");
        return;
      }

      const totalWidth = contentWidth * 2 + 50;
      const speed = 100;
      const duration = totalWidth / speed;

      marquee.style.animationDuration = `${duration}s`;
    }

    // 최초 실행
    action();

    // 리사이즈 시 PC로 전환되면 다시 계산
    window.addEventListener("resize", () => {
      action();
    });
  },
  searchForm() {
    const top_search_field = document.querySelector(".top_search_field");
    if (!top_search_field) {
      return;
    }
    const top_search_input = top_search_field.querySelector(".top_search_input");
    const btn_search_reset = top_search_field.querySelector(".btn_search_reset");
    let input_value_length = 0;
    if (!!top_search_input) {
      top_search_input.addEventListener("input", (e) => {
        input_value_length = e.target.value.length;
        top_search_field.classList.toggle("active", input_value_length);
      });
    }
    if (!!btn_search_reset) {
      btn_search_reset.addEventListener("click", (e) => {
        top_search_input.focus();
        top_search_field.classList.remove("active");
      });
    }
  },
  mobileHeader() {
    function headerNavActive() {
      const container = document.querySelector(".header_nav_container");
      const activeItem = container?.querySelector(".header_nav_menu_item.active");

      if (container && activeItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        // active 항목이 컨테이너 왼쪽보다 왼쪽에 있다면
        if (itemRect.left < containerRect.left) {
          container.scrollLeft -= containerRect.left - itemRect.left + 15;
        }
        // active 항목이 컨테이너 오른쪽보다 오른쪽에 있다면
        else if (itemRect.right > containerRect.right) {
          container.scrollLeft += itemRect.right - containerRect.right + 15;
        }
      }
    }

    const btn_panel_menu = document.querySelector(".btn_panel_menu");
    const btn_panel_close = document.querySelector(".btn_panel_close");
    const htmlAndBody = document.querySelectorAll("html, body");
    const page_wrap = document.querySelector(".page_wrap");
    const mobile_nav_panel = document.querySelector(".mobile_nav_panel");
    const mobile_nav_panel_dim = document.querySelector(".mobile_nav_panel .bg_dim");

    function mobileTotal() {
      let motionTimer = 0;
      let closeItems = [mobile_nav_panel_dim, btn_panel_close];
      if (!!btn_panel_menu) {
        btn_panel_menu.addEventListener("click", (e) => {
          e.preventDefault();
          e.currentTarget.classList.add("hidden");
          htmlAndBody.forEach((item) => {
            item.classList.add("touchDis");
          });
          page_wrap.classList.add("open_mbmenu");
          mobile_nav_panel.classList.add("active");
          if (motionTimer) clearTimeout(motionTimer);
          motionTimer = setTimeout(() => {
            btn_panel_close.classList.add("active");
          }, 30);
        });
      }
      if (closeItems.length) {
        closeItems.forEach((arrItem) => {
          arrItem.addEventListener("click", (e) => {
            e.preventDefault();
            btn_panel_close.classList.remove("active");
            btn_panel_menu.classList.remove("hidden");
            page_wrap.classList.remove("open_mbmenu");
            if (motionTimer) clearTimeout(motionTimer);
            motionTimer = setTimeout(() => {
              mobile_nav_panel.classList.remove("active");
              htmlAndBody.forEach((item) => {
                item.classList.remove("touchDis");
              });
            }, 500);
          });
        });
      }
    }

    function mobileTotalTab() {
      const mb_nav_tab_li = document.querySelectorAll(".mb_nav_tab_list > li");
      const mb_nav_tab = document.querySelectorAll(".mb_nav_tab");
      const mb_nav_cont = document.querySelectorAll(".mb_nav_cont");
      if (!!mb_nav_tab) {
        mb_nav_tab.forEach((eventItem) => {
          eventItem.addEventListener("click", (e) => {
            e.preventDefault();
            const thisTarget = e.currentTarget;
            const thisCont = thisTarget.getAttribute("href");
            const thisContDom = document.querySelector(thisCont);

            mbNavReset();
            if (!!thisContDom) {
              thisContDom.classList.add("active");
            }
            thisTarget.closest("li").classList.add("active");
          });
        });
      }

      function mbNavReset() {
        const resetItem = [...mb_nav_tab_li, ...mb_nav_cont];
        if (!!resetItem) {
          resetItem.forEach((item) => {
            item.classList.remove("active");
          });
        }
      }
    }

    function mobileTotalToggle() {
      const mb_navmenu_toggle = document.querySelectorAll(".mb_navmenu_item.has_arrow");
      if (!!mb_navmenu_toggle) {
        mb_navmenu_toggle.forEach((eventItem) => {
          eventItem.addEventListener("click", (e) => {
            e.preventDefault();
            const thisTarget = e.currentTarget;
            thisTarget.closest("li").classList.toggle("toggle_active");
          });
        });
      }
    }

    function mobileTotalReset() {
      let motionTimer2 = 0;
      btn_panel_close.classList.remove("active");
      btn_panel_menu.classList.remove("hidden");
      page_wrap.classList.remove("open_mbmenu");
      if (motionTimer2) clearTimeout(motionTimer);
      motionTimer2 = setTimeout(() => {
        mobile_nav_panel.classList.remove("active");
        htmlAndBody.forEach((item) => {
          item.classList.remove("touchDis");
        });
      }, 500);
    }

    // 최초 실행
    headerNavActive();
    mobileTotal();
    mobileTotalTab();
    mobileTotalToggle();

    // 리사이즈 시 debounce 처리 후 실행
    let resizeTimer;
    window.addEventListener("resize", () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        headerNavActive();
        if (window.innerWidth >= 1024) {
          mobileTotalReset();
        }
      }, 100); // 30ms → 100ms로 여유 있게 설정 (디바운싱)
    });
  },
  setVhProperty() {
    setProperty();
    window.addEventListener("resize", () => {
      setProperty();
    });

    function setProperty() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  },
  pageTopgo() {
    const btn_topgo = document.querySelector(".btn_topgo");
    if (!!btn_topgo) {
      btn_topgo.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      });
    }
  },
  footerSelector() {
    const visibleItems = document.querySelectorAll(".footer_menu_list > li:not(.mb_hidden)");
    const footer_menu_li_last = visibleItems[visibleItems.length - 1];
    if (!!footer_menu_li_last) {
      footer_menu_li_last.classList.add("mb_last");
    }
  },
  datePiceker() {
    $(function() {
      $(".box_input.calendar").datepicker({
        dateFormat: "yy-mm-dd", // 날짜 형식
        showButtonPanel: true, // 오늘/완료 버튼 표시
        showMonthAfterYear: true,
        yearSuffix: "년",
        closeText: "닫기",
        prevText: "이전달",
        nextText: "다음달",
        currentText: "오늘",
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
        showOtherMonths: true, // 👉 이전/다음 달 날짜도 달력에 표시
        selectOtherMonths: true, // 👉 이전/다음 달 날짜도 선택 가능
        onSelect: function(dateText, inst) {
          console.log("선택한 날짜:", dateText);
        },
      });
    });
  },
};

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
        element.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            this.popupHide(this.selector);
          },
          false
        );
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
  popupShow(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
      if ("openCallback" in instance_option) {
        instance_option.openCallback();
      }
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    this.layer_wrap_parent.append(this.selector);
    this.dimCheck();
  }
  popupHide(option) {
    let target = this.option.selector;
    let instance_option = option || {};
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
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = 0;
        } else {
          if ("closeCallback" in this.option) {
            this.option.closeCallback();
          }
          closeTimer = setTimeout(() => {
            if ("closeCallback" in instance_option) {
              instance_option.closeCallback();
            }
          }, 30);
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
  let okTextNode = option.okText ?? "확인";
  let cancelTextNode = option.cancelText ?? "취소";
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
  if (showNum) {
    clearTimeout(showNum);
  }
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
  if (!submitBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("submit_not");
  }
  if (!!btn_modal_submit) {
    btn_modal_submit.forEach((item) => {
      let eventIs = false;

      if (!submitBtnDisplay) {
        item.remove();
        btn_modal_submit_wrap.remove();
      } else {
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
  if (!closeBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("close_not");
  }
  if (!!btn_modal_close) {
    btn_modal_close.forEach((item) => {
      let eventIs = false;
      if (!closeBtnDisplay) {
        item.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          closeAction();
          eventIs = true;
        });
      }
    });
  }

  function closeAction() {
    let actionNum = 0;
    modal_item.classList.remove("motion_end");
    if (design_popup_wrap_active.length === 0) {
      domHtml.classList.remove("touchDis");
    }
    if (actionNum) {
      clearTimeout(actionNum);
    }
    actionNum = setTimeout(() => {
      modal_item.classList.remove("active");
      modal_item.remove();
    }, 500);
  }
}

function showInputRequiredModal(message, okcallback = null) {
  const modalOption = {
    message,

    modaltype: "",

    okcallback() {
      if (typeof okcallback === "function") {
        okcallback(); // 외부 콜백 호출
      }
    },
  };

  designModal(modalOption);
}

function tableTrSelector(selector) {
  const table = document.querySelector(selector);
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tbody tr"));

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll("td[rowspan]");
    cells.forEach((cell) => {
      const rowspan = parseInt(cell.getAttribute("rowspan"), 10);
      if (rowspan > 1) {
        const endRow = rows[rowIndex + rowspan - 1];
        if (endRow) {
          endRow.classList.add("rowspan_end");
        }
      }
    });
  });
}

/* combo box */
function comboFunc() {
  const combo_item = document.querySelectorAll(".combo_item");
  const combo_option_group = document.querySelectorAll(".combo_option_group");
  addDynamicEventListener(document.body, "click", ".combo_target", function(e) {
    let thisTarget = e.target;
    let thisParent = thisTarget.closest(".combo_item");
    let thisOptionGroup = thisParent.querySelector(".combo_option_group");
    let appendOption = null;
    let combo_option_scroll = null;
    if (thisOptionGroup !== null) {
      comboInit(thisParent);
    }
    comboPosAction();
    // not
    combo_item.forEach((element) => {
      if (element !== thisParent) {
        element.classList.remove("active");
      }
    });
    appendOption = document.querySelector(`[data-option='${thisParent.getAttribute("id")}']`);
    combo_option_scroll = appendOption.querySelector(".combo_option_scroll");
    appendOptionListOption = combo_option_scroll.getAttribute("data-rowCount") !== null ? combo_option_scroll.getAttribute("data-rowCount") : 5;
    combo_option_group.forEach((element) => {
      if (element !== appendOption) {
        element.classList.remove("active");
      }
    });
    thisParent.classList.toggle("active");
    appendOption.classList.toggle("active");
    if (appendOption.classList.contains("active")) {
      if (combo_option_scroll.classList.contains("addHeight")) {
        return;
      }
      if (appendOption.querySelectorAll("li")[appendOptionListOption] !== undefined) {
        combo_option_scroll.style.maxHeight = `${appendOption.querySelectorAll("li")[appendOptionListOption].offsetTop /* +7 */}px`;
      }
      console.log(appendOptionListOption);
      combo_option_scroll.classList.add("addHeight");
    }
  });
  addDynamicEventListener(document.body, "click", ".combo_option", function(e) {
    let thisTarget = e.target;
    let thisParent = thisTarget.closest(".combo_option_group");
    let thisTargetText = thisTarget.textContent;
    let comboCallItem = document.querySelector(`[id='${thisParent.getAttribute("data-option")}']`);
    let comboCallTarget = comboCallItem.querySelector(".combo_target");

    if (thisTarget.classList.contains("disabled")) {
      return;
    }
    comboCallTarget.textContent = thisTargetText;
    thisParent.classList.remove("active");
    comboCallItem.classList.remove("active");
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest(".combo_item") !== null) {
      return;
    }
    comtoReset();
  });

  let currentWid = window.innerWidth;
  window.addEventListener("resize", () => {
    if (currentWid !== window.innerWidth) {
      comboPosAction();
    }
    currentWid = window.innerWidth;
  });

  function comtoReset() {
    const combo_item = document.querySelectorAll(".combo_item");
    const combo_option_group = document.querySelectorAll(".combo_option_group");

    combo_item.forEach((element) => {
      element.classList.remove("active");
    });
    combo_option_group.forEach((element) => {
      element.classList.remove("active");
    });
  }

  function comboInit() {
    const combo_item = document.querySelectorAll(".combo_item");
    const appBody = document.querySelector(".page_wrap");

    combo_item.forEach((element, index) => {
      let thisElement = element;
      let option_group = thisElement.querySelector(".combo_option_group");
      if (element.getAttribute("id") === null) {
        thisElement.setAttribute("id", "combo_item_" + index);
        option_group.setAttribute("data-option", "combo_item_" + index);
      } else {
        option_group.setAttribute("data-option", thisElement.getAttribute("id"));
      }
      if (element.closest(".fullpop_contlow") !== null) {
        element.closest(".fullpop_contlow").appendChild(option_group);
      } else {
        appBody.appendChild(option_group);
      }
    });
  }

  function comboPosAction() {
    const appendOption = document.querySelectorAll(".combo_option_group");
    appendOption.forEach((element, index) => {
      let comboCall = document.querySelector(`[id='${element.getAttribute("data-option")}']`);
      if (!comboCall) {
        return;
      }
      let combo_top = window.scrollY + comboCall.getBoundingClientRect().top;
      let fullpop_contlow_top = 0;
      let combo_left = comboCall.getBoundingClientRect().left;
      let fullpop_contlow_left = 0;

      if (comboCall.closest(".fullpop_contlow") !== null) {
        fullpop_contlow_top = comboCall.closest(".fullpop_contlow").getBoundingClientRect().top;
        fullpop_contlow_left = comboCall.closest(".fullpop_contlow").getBoundingClientRect().left;
        element.setAttribute(
          "style",
          `
                    top : ${combo_top - fullpop_contlow_top + comboCall.getBoundingClientRect().height - 1}px; 
                    left : ${combo_left - fullpop_contlow_left}px;
                    width : ${comboCall.getBoundingClientRect().width}px;
                `
        );
      } else {
        element.setAttribute(
          "style",
          `
                    top : ${combo_top + comboCall.getBoundingClientRect().height - 1}px; 
                    left : ${combo_left}px;
                    width : ${comboCall.getBoundingClientRect().width}px;
                `
        );
      }
    });
  }
}

function comboChangeCallback(option) {
  addDynamicEventListener(document.body, "click", `[data-option='${option.target}'] .combo_option`, function(e) {
    let thisEventObj = e.target;
    let thisEventObjValue = thisEventObj.getAttribute("data-value");
    if ("callback" in option) {
      option.callback(thisEventObjValue);
    }
  });
}

function responColWidth() {
  const respon_col_tb = document.querySelectorAll(".respon_col_tb");
  action();

  window.addEventListener("resize", () => {
    action();
  });

  function action() {
    if (respon_col_tb.length) {
      respon_col_tb.forEach((item) => {
        const tb_item = item;
        const colTag = tb_item.querySelectorAll("colgroup col");
        colTag.forEach((thisItem) => {
          if (!thisItem.dataset.pc || !thisItem.dataset.tablet) {
            return;
          }
          if (window.innerWidth > 1280) {
            thisItem.style.width = thisItem.dataset.pc;
          } else {
            thisItem.style.width = thisItem.dataset.tablet;
          }
          console.log(thisItem.dataset.pc, thisItem.dataset.tablet);
        });
      });
    }
  }
}

function responWidFunc() {
  const responDom = $("[data-pcwid]");
  action();
  $(window).on("resize", function() {
    action();
  });

  function action() {
    responDom.css("width", "");
    if ($(window).width() > 1023) {
      responDom.each(function() {
        const $this = $(this);
        $this.css("width", $this.attr("data-pcwid"));
      });
    }
  }
}

function responThFunc(target) {
  const respond_fieldset_tb = $(target) || target;
  action();
  $(window).on("resize", function() {
    action();
  });

  function action() {
    console.log(target);
    respond_fieldset_tb.each(function() {
      const $thisTb = $(this);
      const $thisThText = $thisTb.find(".fset_thtext");
      const $thisThCols = $thisTb.find(".fset_th_cols");
      let $thisMaxArray = [];
      $thisThCols.css("width", "");
      if ($(window).width() <= 1023) {
        $thisThText.each(function() {
          $thisMaxArray.push($(this).outerWidth());
        });
        $thisThCols.css("width", Math.max.apply(null, $thisMaxArray) + 20);
      }
    });
  }
}

function responFileLabelFunc(target) {
  const respond_fieldset_tb = $(target) || target;
  action();
  $(window).on("resize", function() {
    action();
  });

  function action() {
    respond_fieldset_tb.each(function() {
      const $thisTb = $(this);
      const $thisThText = $thisTb.find(".fieldset_label");
      const $thisThCols = $thisTb.find(".label_cols");
      let $thisMaxArray = [];
      $thisThCols.css("width", "");
      if ($(window).width() > 1023) {
        $thisThText.each(function() {
          $thisMaxArray.push($(this).outerWidth());
        });
        $thisThCols.css("width", Math.max.apply(null, $thisMaxArray));
      }
    });
  }
}