import { useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/postService";
import { getStoredUserId } from "../../store/slice/postUtils";
import "./CreatePostPage.css";

const FORM_ID = "create-post-form";

function countWords(text) {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export default function CreatePostPage() {
  const navigate = useNavigate();
  const titleId = useId();
  const bodyId = useId();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wordCount = useMemo(() => countWords(body), [body]);
  const overLimit = wordCount > 1000;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!title.trim()) {
      setSubmitError("Vui lòng nhập tiêu đề.");
      return;
    }
    if (!body.trim()) {
      setSubmitError("Vui lòng nhập nội dung bài viết.");
      return;
    }
    if (overLimit) {
      setSubmitError("Nội dung vượt quá 1000 từ.");
      return;
    }
    const userId = getStoredUserId();
    if (!userId) {
      setSubmitError("Bạn cần đăng nhập để đăng bài.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createPost(userId, {
        postTitle: title.trim(),
        postContent: body.trim(),
        status: "ACTIVE",
      });
      const id = created?.id;
      if (id) navigate(`/posts/${id}`);
      else navigate("/posts");
    } catch (err) {
      setSubmitError(err.message || "Đăng bài thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-post" data-name="Tạo bài viết" data-node-id="28:9">
      <header className="create-post__header" data-node-id="28:10">
        <div className="create-post__header-inner">
          <h1 className="create-post__community" data-node-id="I28:10;11:57">
            Cộng đồng
          </h1>
          <button
            type="submit"
            form={FORM_ID}
            className="create-post__submit-header"
            data-node-id="I28:10;11:106;11:103"
            disabled={submitting}
          >
            {submitting ? "Đang gửi…" : "Đăng bài"}
          </button>
        </div>
      </header>

      <main className="create-post__main">
        <form
          id={FORM_ID}
          className="create-post__form"
          onSubmit={handleSubmit}
          noValidate
        >
          {submitError ? (
            <p className="create-post__form-error" role="alert">
              {submitError}
            </p>
          ) : null}

          <div
            className="create-post__title-card"
            data-name="Component 6"
            data-node-id="20:72"
          >
            <label
              className="create-post__title-label"
              htmlFor={titleId}
              data-node-id="20:71"
            >
              Tạo bài viết của bạn ngay
            </label>
            <input
              id={titleId}
              name="title"
              className="create-post__title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhâp tiêu đề ấn tượng của bạn..."
              autoComplete="off"
              data-node-id="20:24"
              disabled={submitting}
            />
          </div>

          <div
            className="create-post__body-card"
            data-name="Component 8"
            data-node-id="20:74"
          >
            <div
              className="create-post__divider"
              aria-hidden
              data-node-id="20:28"
            >
              <img src="/posts/editor-line.png" alt="" />
            </div>
            <label className="create-post__visually-hidden" htmlFor={bodyId}>
              Nội dung bài viết
            </label>
            <textarea
              id={bodyId}
              name="body"
              className="create-post__body-input"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Bắt đầu viết nội dung bài viết của bạn..."
              rows={12}
              data-node-id="20:27"
              disabled={submitting}
            />
            <p
              className={`create-post__notice ${overLimit ? "create-post__notice--warn" : ""}`}
              data-node-id="20:69"
            >
              {"Chú ý:  Nội dung bài viết giới hạn 1000 từ."}
              {body.trim() ? (
                <span className="create-post__word-count">
                  {" "}
                  ({wordCount}/1000)
                </span>
              ) : null}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
