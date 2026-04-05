import './siteFooter.css'

const FOOTER_LINE = '/landing/footer-line.png'

export default function SiteFooter() {
  return (
    <footer className="landing__footer" data-name="Footer">
      <div className="landing__container landing__footer-inner">
        <div className="landing__footer-top">
          <div className="landing__footer-brand">
            <p className="landing__footer-logo">acneCare</p>
            <p className="landing__footer-desc">
              Nền tảng ứng dụng trí tuệ nhân tạo giúp phân tích tình trạng mụn,
              kết nối bác sĩ da liễu và đồng hành cùng bạn trên hành trình chăm
              sóc da.
            </p>
          </div>
          <div className="landing__footer-col">
            <h3 className="landing__footer-heading">Về acneCare</h3>
            <ul className="landing__footer-links">
              <li>
                <a href="#">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>
          <div className="landing__footer-col">
            <h3 className="landing__footer-heading">Kết nối chúng tôi</h3>
            <ul className="landing__footer-links">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">Email hỗ trợ</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="landing__footer-newsletter">
          <p className="landing__footer-newsletter-text">
            Đăng ký nhận bản tin của chúng tôi để cập nhật những thông tin mới
            nhất
          </p>
          <div className="landing__footer-form">
            <label className="landing__footer-email-label" htmlFor="footer-email">
              <span className="landing__visually-hidden">Email</span>
              <input
                id="footer-email"
                className="landing__footer-input"
                type="email"
                placeholder="Nhập email của bạn"
                autoComplete="email"
              />
            </label>
            <button type="button" className="landing__footer-submit">
              Đăng ký
            </button>
          </div>
        </div>

        <div className="landing__footer-rule" aria-hidden="true">
          <img src={FOOTER_LINE} alt="" />
        </div>
        <p className="landing__footer-copy">Bản quyền © acneCare</p>
      </div>
    </footer>
  )
}
