export default function Footer() {
  return (
    <footer className="layout-footer">
      <div className="layout-footer__inner">
        <div>
          <p className="layout-footer__brand">acneCare</p>
          <p className="layout-footer__desc">
            Nền tảng ứng dụng trí tuệ nhân tạo giúp phân tích tình trạng mụn,
            kết nối bác sĩ da liễu và đồng hành cùng bạn trên hành trình chăm
            sóc da.
          </p>
        </div>

        <div>
          <p className="layout-footer__col-title">Về acneCare</p>
          <ul className="layout-footer__links">
            <li><a href="#">Trung tâm trợ giúp</a></li>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        <div>
          <p className="layout-footer__col-title">Kết nối chúng tôi</p>
          <ul className="layout-footer__links">
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Email hỗ trợ</a></li>
          </ul>
        </div>
      </div>

      <div className="layout-footer__newsletter">
        <p className="layout-footer__newsletter-text">
          Đăng ký nhận bản tin của chúng tôi để cập nhật những thông tin mới nhất
        </p>
        <div className="layout-footer__form">
          <div className="layout-footer__fake-input">Nhập email của bạn</div>
          <button type="button" className="layout-footer__submit">
            Đăng ký
          </button>
        </div>
      </div>

      <p className="layout-footer__copy">Bản quyền © acneCare</p>
    </footer>
  )
}
