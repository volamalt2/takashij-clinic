/**
 * TAKASHIJ CLINIC - INTERACTIVITY SCRIPT
 * Takashij Clinic Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  // Smooth scroll back to top
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Philosophy Section Interactive Tabs & Image Switcher (Desktop & Mobile)
  const philosophyCards = document.querySelectorAll('.philosophy-card');
  const philosophyImgs = document.querySelectorAll('.philosophy-img');
  const philosophyTabBtns = document.querySelectorAll('.philosophy-tab-btn');

  function setPhilosophyActive(targetIndex) {
    philosophyCards.forEach((c) => {
      if (c.getAttribute('data-index') === targetIndex) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    philosophyImgs.forEach((img) => {
      if (img.getAttribute('data-index') === targetIndex) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });

    philosophyTabBtns.forEach((btn) => {
      if (btn.getAttribute('data-index') === targetIndex) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });
  }

  if (philosophyCards.length && philosophyImgs.length) {
    philosophyCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        setPhilosophyActive(card.getAttribute('data-index'));
      });

      card.addEventListener('click', () => {
        setPhilosophyActive(card.getAttribute('data-index'));
      });
    });

    // Mobile tabs click handler
    philosophyTabBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setPhilosophyActive(btn.getAttribute('data-index'));
      });
    });

    // Touch swipe left/right support on mobile
    const philosophyWrapper = document.querySelector('.philosophy-slider-wrapper');
    if (philosophyWrapper) {
      let touchStartX = 0;
      let touchEndX = 0;
      philosophyWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      philosophyWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          const activeCard = document.querySelector('.philosophy-card.active');
          let currentIdx = activeCard ? parseInt(activeCard.getAttribute('data-index'), 10) : 1;
          if (diff > 0) {
            // swipe left -> next pillar
            currentIdx = currentIdx >= 4 ? 1 : currentIdx + 1;
          } else {
            // swipe right -> prev pillar
            currentIdx = currentIdx <= 1 ? 4 : currentIdx - 1;
          }
          setPhilosophyActive(String(currentIdx));
        }
      }, { passive: true });
    }
  }

  // 3. Search Modal Popup
  const searchBtn = document.querySelector('.header-search-btn');
  const searchModal = document.querySelector('.search-modal');
  const searchClose = document.querySelector('.search-close-btn');

  if (searchBtn && searchModal && searchClose) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      setTimeout(() => {
        document.querySelector('.search-modal-input')?.focus();
      }, 200);
    });

    searchClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
    });

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
      }
    });
  }

  // 4. Mobile Menu Drawer (Supports Header button & Web App Bottom Bar button)
  const mobileToggles = document.querySelectorAll('.mobile-menu-toggle, .mobile-app-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileClose = document.querySelector('.mobile-drawer-close');

  const closeMobileNav = () => {
    mobileDrawer?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileDrawer && mobileOverlay) {
    mobileToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        mobileDrawer.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    mobileClose?.addEventListener('click', closeMobileNav);
    mobileOverlay.addEventListener('click', closeMobileNav);

    // Close drawer when clicking regular menu links
    const drawerLinks = mobileDrawer.querySelectorAll('.mobile-menu-list a:not([data-toggle])');
    drawerLinks.forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // 5. Initialize Swiper Carousels
  if (typeof Swiper !== 'undefined') {
    // 0. Hero Swiper (Driven by 4 Highlight Pillars, Auto-roll 3600ms, No arrows or dots)
    const heroSwiperEl = document.querySelector('.hero-swiper');
    if (heroSwiperEl) {
      const heroSwiper = new Swiper('.hero-swiper', {
        slidesPerView: 1,
        loop: true,
        speed: 750,
        effect: 'slide',
        autoplay: {
          delay: 3600,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        keyboard: {
          enabled: true,
        },
        allowTouchMove: true,
      });

      const pillarItems = document.querySelectorAll('.pillar-item');

      function updateActivePillar(realIdx) {
        pillarItems.forEach((item) => {
          const itemIdx = parseInt(item.getAttribute('data-slide-index'), 10);
          if (itemIdx === realIdx) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }

      heroSwiper.on('slideChange', function () {
        updateActivePillar(heroSwiper.realIndex);
      });

      pillarItems.forEach((item) => {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          const targetIndex = parseInt(this.getAttribute('data-slide-index'), 10);
          heroSwiper.slideToLoop(targetIndex, 650);
          updateActivePillar(targetIndex);
          if (heroSwiper.autoplay && heroSwiper.autoplay.running === false) {
            heroSwiper.autoplay.start();
          }
        });

        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const targetIndex = parseInt(this.getAttribute('data-slide-index'), 10);
            heroSwiper.slideToLoop(targetIndex, 650);
            updateActivePillar(targetIndex);
          }
        });
      });
    }

    // Facilities Swiper (Centered-Scale 3D / Draggable Coverflow Gallery)
    new Swiper('.facilities-swiper', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 28,
      loop: true,
      initialSlide: 0,
      loopAdditionalSlides: 4,
      grabCursor: true,
      slideToClickedSlide: true,
      speed: 650,
      watchSlidesProgress: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.facilities-nav-next',
        prevEl: '.facilities-nav-prev',
      },
      pagination: {
        el: '.facilities-pagination',
        clickable: true,
      },
      keyboard: {
        enabled: true,
      },
    });

    // Experts Swiper
    new Swiper('.experts-swiper', {
      slidesPerView: 1,
      spaceBetween: 25,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.experts-next',
        prevEl: '.experts-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }
    });

    // Testimonials Swiper
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.testimonials-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.testimonials-next',
        prevEl: '.testimonials-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2 },
      }
    });

    // Partners Swiper (if swiper layout is present)
    if (document.querySelector('.partners-carousel.swiper')) {
      new Swiper('.partners-carousel', {
        slidesPerView: 2.5,
        spaceBetween: 30,
        loop: true,
        allowTouchMove: false,
        speed: 4000,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        breakpoints: {
          576: { slidesPerView: 4, spaceBetween: 30 },
          992: { slidesPerView: 6, spaceBetween: 40 },
          1400: { slidesPerView: 7, spaceBetween: 50 },
        }
      });
    }
  }

  // 6. Flatpickr Datepicker Initialization
  if (typeof flatpickr !== 'undefined') {
    flatpickr("#booking-date", {
      dateFormat: "d/m/Y",
      minDate: "today",
      locale: {
        firstDayOfWeek: 1
      }
    });
  }

  // 7. Booking Form Submission Mock
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('booking-name').value;
      const phone = document.getElementById('booking-phone').value;
      const date = document.getElementById('booking-date').value;

      if (!name || !phone || !date) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
        return;
      }

      alert(`Cảm ơn quý khách ${name}! Viện Nghiên Cứu Sức Khỏe - TAKASHIJ CLINIC đã tiếp nhận yêu cầu đặt lịch ngày ${date}. Nhân viên y tế sẽ liên hệ số điện thoại ${phone} để xác nhận trong ít phút.`);
      bookingForm.reset();
    });
  }

  // 8. Expert Profile Modal Popup (Gold Luxury Border & Achievements)
  const expertData = {
    'phan-toan-thang': {
      name: 'PGS.TS.BS PHAN TOÀN THẮNG',
      badge: 'CHUYÊN GIA TẾ BÀO GỐC QUỐC TẾ',
      role: 'Chuyên gia hàng đầu thế giới về Y học tái tạo & Tế bào gốc',
      workplace: 'Cố vấn Cấp cao Takashij Clinic | Phó Giáo sư tại Đại học Quốc gia Singapore (NUS)',
      img: 'assets/images/experts/bac_thang_sharpened_v2.jpg',
      specialties: 'Y học tái tạo đa mô, công nghệ tế bào gốc màng dây rốn (Umbilical Cord Lining), điều trị vết thương mãn tính và sẹo bỏng sâu, tái sinh cấu trúc da và mô liên kết sinh học.',
      achievements: [
        'Nhà khoa học đầu tiên trên thế giới phát minh và sở hữu bằng sáng chế độc quyền về công nghệ tách chiết tế bào gốc từ màng dây rốn tại hơn 40 quốc gia (Mỹ, Châu Âu, Nhật Bản, Singapore...).',
        'Nhà sáng lập CellResearch Corporation – tập đoàn công nghệ sinh học tiên phong đưa giải pháp tế bào gốc ứng dụng vào y lâm sàng quốc tế.',
        'Tác giả của hơn 100 công trình nghiên cứu và báo cáo khoa học được bình duyệt trên các tập san y học danh tiếng toàn cầu như The Lancet, Cell Stem Cell.'
      ],
      credentials: [
        'Tiến sĩ Y khoa - Bác sĩ phẫu thuật xuất sắc tốt nghiệp tại Học viện Quân Y.',
        'Nghiên cứu sinh và Giảng viên nghiên cứu sau Tiến sĩ tại Viện Nhi khoa Hoàng gia Anh và Đại học Oxford.',
        'Hội viên thường trực Hội Y học Tái tạo Quốc tế (TERMIS) và Hiệp hội Liệu pháp Tế bào Quốc tế (ISCT).'
      ]
    },
    'zen-kubota': {
      name: 'BS. ZEN KUBOTA',
      badge: 'CHUYÊN GIA Y HỌC DỰ PHÒNG NHẬT BẢN',
      role: 'Giám đốc Phòng khám Tokyo Clinic | Chuyên gia Chống lão hóa',
      workplace: 'Giám đốc Điều hành Tokyo Clinic (Tokyo, Nhật Bản) | Cố vấn Y khoa Quốc tế Takashij Clinic',
      img: 'assets/images/experts/chuyengia-04.png',
      specialties: 'Y học dự phòng đa tầng, nội khoa tổng quát, thẩm mỹ công nghệ cao & trẻ hóa tế bào không xâm lấn, kiểm soát nguy cơ tim mạch và tiểu đường theo chuẩn y tế Nhật Bản.',
      achievements: [
        'Hơn 20 năm kinh nghiệm lâm sàng và điều hành hệ thống phòng khám cao cấp tại khu trung tâm Ginza và Shinjuku (Tokyo).',
        'Trực tiếp chăm sóc và cố vấn lộ trình sống khỏe, trẻ hóa toàn diện cho hàng ngàn chính khách, doanh nhân và ngôi sao hàng đầu Nhật Bản.',
        'Tiên phong ứng dụng các phương pháp thải độc y khoa và liệu pháp truyền vi chất tăng cường sinh lực an toàn tuyệt đối.'
      ],
      credentials: [
        'Tốt nghiệp Bác sĩ Y khoa tại Đại học Y Teikyo (Tokyo, Nhật Bản).',
        'Thành viên thường trực Hội Y học Chống Lão hóa Nhật Bản (JAAM).',
        'Ủy viên Hiệp hội Thẩm mỹ Nội khoa Nhật Bản (JSAPS).'
      ]
    },
    'atsushi-sato': {
      name: 'BS. ATSUSHI SATO',
      badge: 'CHUYÊN GIA CHẤN THƯƠNG CHỈNH HÌNH',
      role: 'Giảng viên Khoa Chấn thương Chỉnh hình / Đại học Showa',
      workplace: 'Giảng viên - Bác sĩ phẫu thuật Khoa Chỉnh hình Đại học Y khoa Showa (Tokyo, Nhật Bản)',
      img: 'assets/images/experts/chuyengia-02.png',
      specialties: 'Chẩn đoán và can thiệp bảo tồn bệnh lý cơ xương khớp, liệu pháp sinh học tái tạo sụn khớp (PRP, Cytokine therapy), phục hồi vận động không xâm lấn.',
      achievements: [
        'Chuyên gia đầu ngành về điều trị thoái hóa khớp gối và cột sống bằng giải pháp y học tái tạo không cần can thiệp phẫu thuật mở.',
        'Báo cáo viên chính tại nhiều Hội nghị Chấn thương Chỉnh hình Quốc tế tại Nhật Bản, Hoa Kỳ và Châu Âu.',
        'Ứng dụng thành công hệ thống định vị siêu âm 3D trong điều trị chính xác tổn thương gân cơ dây chằng.'
      ],
      credentials: [
        'Tốt nghiệp Bác sĩ Chuyên khoa Chấn thương Chỉnh hình tại Đại học Y khoa Showa danh tiếng.',
        'Thành viên Hội Chấn thương Chỉnh hình Nhật Bản (JOA).',
        'Chứng chỉ Phục hồi chức năng thể thao chuyên nghiệp Nhật Bản (JASA).'
      ]
    },
    'yohei-ko': {
      name: 'TS.BS. YOHEI KO',
      badge: 'VIỆN TRƯỞNG TẾ BÀO GỐC NHẬT BẢN',
      role: 'Viện trưởng Viện Nghiên Cứu Tế Bào Gốc Nhật Bản',
      workplace: 'Viện trưởng Viện Tế bào gốc Nhật Bản | Trưởng Khối Liệu pháp Miễn dịch Takashij Clinic',
      img: 'assets/images/experts/chuyengia-01.png',
      specialties: 'Liệu pháp tế bào miễn dịch tự thân (Tế bào diệt tự nhiên NK, T-cell), kích hoạt hệ miễn dịch phòng chống ung thư, y học phục hồi chức năng tạng.',
      achievements: [
        'Chủ trì nhiều đề tài nghiên cứu quốc gia của Nhật Bản về ứng dụng tế bào miễn dịch tự thân trong phòng ngừa tái phát u bướu.',
        'Phát triển quy trình nuôi cấy và hoạt hóa tế bào NK đạt hoạt tính sinh học vượt trội tại phòng sạch chuẩn GMP-Grade.',
        'Chuyển giao công nghệ trị liệu miễn dịch tiên tiến cho các trung tâm y tế quốc tế hàng đầu tại Tokyo, Osaka và Seoul.'
      ],
      credentials: [
        'Tiến sĩ Y khoa chuyên ngành Sinh học Phân tử & Miễn dịch học tại Đại học Y khoa Tokyo.',
        'Thành viên Hiệp hội Nghiên cứu Ung thư Nhật Bản (JCA).',
        'Thành viên Hiệp hội Liệu pháp Miễn dịch Sinh học Quốc tế (iSBT).'
      ]
    },
    'shouichi-yamaguchi': {
      name: 'CHUYÊN GIA SHOUICHI YAMAGUCHI',
      badge: 'CHUYÊN GIA AGEs & TRƯỜNG THỌ',
      role: 'Chuyên gia nghiên cứu AGEs & Độc chất học Lão hóa',
      workplace: 'Trưởng Ban Nghiên cứu Viện Y học Trường thọ Nhật Bản | Cố vấn Khoa học Takashij Clinic',
      img: 'assets/images/experts/chuyengia-03.png',
      specialties: 'Đo lường và can thiệp ức chế sản phẩm đường hóa nâng cao (AGEs), ngăn chặn xơ cứng động mạch, thoái hóa thần kinh và biến chứng lão hóa sớm.',
      achievements: [
        'Tác giả sáng chế thiết bị và quy trình phân tích quang học đánh giá mức độ tích tụ AGEs qua da mà không cần xâm lấn lấy máu.',
        'Công bố hơn 50 bài báo khoa học về mối liên hệ mật thiết giữa AGEs, hội chứng chuyển hóa và tuổi thọ sinh học của con người.',
        'Đồng phát triển các phác đồ vi dinh dưỡng triệt tiêu gốc tự do và đảo ngược quá trình đường hóa nội sinh.'
      ],
      credentials: [
        'Thạc sĩ Hóa Sinh Lâm sàng & Độc chất học tại Đại học Kyoto.',
        'Hội viên cao cấp Hội Nghiên cứu Glycation Quốc tế (IMARS).',
        'Cố vấn chiến lược cho các tập đoàn Dược - Mỹ phẩm hàng đầu Nhật Bản.'
      ]
    },
    'takashi-nakamura': {
      name: 'BS. TAKASHI NAKAMURA',
      badge: 'CHUYÊN GIA NHA KHOA KỸ THUẬT CAO',
      role: 'Trưởng Khoa Nha Khoa Kỹ Thuật Cao & Thẩm Mỹ Takashij',
      workplace: 'Nguyên Trưởng khoa Nha Thẩm mỹ Tokyo Dental Center | Trưởng khoa Nha Takashij Clinic',
      img: 'assets/images/doctor-explain.jpg',
      specialties: 'Cấy ghép Implant kỹ thuật số không đau, phục hình răng sứ thẩm mỹ bảo tồn tủy, chỉnh nha vô hình 3D, thiết kế nụ cười nhân trắc học Nhật Bản.',
      achievements: [
        'Hơn 18 năm kinh nghiệm chuyên sâu trong lĩnh vực nha khoa tái tạo và phục hình thẩm mỹ chuẩn Nhật Bản.',
        'Thực hiện thành công hơn 3.500 ca cấy ghép Implant và kiến tạo nụ cười hoàn mỹ cho các doanh nhân, nghệ sĩ.',
        'Ứng dụng thành công công nghệ chẩn đoán CT Cone Beam 3D và scan trong miệng kỹ thuật số, lập kế hoạch điều trị chuẩn xác từng milimet.'
      ],
      credentials: [
        'Tốt nghiệp Bác sĩ Nha khoa tại Đại học Nha khoa Tokyo (Tokyo Dental College) danh tiếng.',
        'Thành viên Hiệp hội Cấy ghép Nha khoa Quốc tế (ICOI).',
        'Chứng chỉ Chỉnh nha Kỹ thuật số Hoa Kỳ & Nhật Bản.'
      ]
    }
  };

  const expertModal = document.getElementById('expertModal');
  if (expertModal) {
    const modalImg = document.getElementById('modalExpertImg');
    const modalBadge = document.getElementById('modalExpertBadge');
    const modalName = document.getElementById('modalExpertName');
    const modalRole = document.getElementById('modalExpertRole');
    const modalWorkplace = document.getElementById('modalExpertWorkplace');
    const modalSpecialties = document.getElementById('modalExpertSpecialties');
    const modalAchievements = document.getElementById('modalExpertAchievements');
    const modalCredentials = document.getElementById('modalExpertCredentials');
    const closeBtn = expertModal.querySelector('.expert-modal-close');

    function openExpertModal(expertKey) {
      const data = expertData[expertKey];
      if (!data) return;

      modalImg.src = data.img;
      modalImg.alt = data.name;
      modalBadge.textContent = data.badge;
      modalName.textContent = data.name;
      modalRole.textContent = data.role;
      modalWorkplace.textContent = data.workplace;
      modalSpecialties.textContent = data.specialties;

      modalAchievements.innerHTML = data.achievements.map(item => `<li>${item}</li>`).join('');
      modalCredentials.innerHTML = data.credentials.map(item => `<li>${item}</li>`).join('');

      expertModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeExpertModal() {
      expertModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.expert-card').forEach(card => {
      card.addEventListener('click', function () {
        const key = this.getAttribute('data-expert');
        if (key) {
          openExpertModal(key);
        }
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const key = this.getAttribute('data-expert');
          if (key) {
            openExpertModal(key);
          }
        }
      });
    });

    closeBtn?.addEventListener('click', closeExpertModal);

    expertModal.addEventListener('click', function (e) {
      if (e.target === expertModal) {
        closeExpertModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && expertModal.classList.contains('is-open')) {
        closeExpertModal();
      }
    });
  }

  // 12. Department FAQ Accordion Handler
  document.querySelectorAll('.dept-accordion-header').forEach((btn) => {
    btn.addEventListener('click', function () {
      const item = this.closest('.dept-accordion-item');
      if (item) {
        const isOpen = item.classList.contains('active');
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.dept-accordion-item').forEach((sib) => {
            sib.classList.remove('active');
          });
        }
        if (!isOpen) {
          item.classList.add('active');
        }
      }
    });
  });
});

