import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../../services/postService";
import { getStoredUserId } from "../../store/slice/postUtils";
import "./EditPostPage.css";

const FORM_ID = "edit-post-form";

function countWords(text) {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export default function EditPostPage() {
  const { postId } = useParams();
  return <EditPostForm key={postId} postId={postId} />;
}

function EditPostForm({ postId }) {
  const navigate = useNavigate();
  const titleId = useId();
  const bodyId = useId();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    (async () => {
      try {
        // #region agent log
        fetch("http://127.0.0.1:7869/ingest/e2d441e0-ed91-4df0-a430-b8cf821f258a", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "d81eb2",
          },
          body: JSON.stringify({
            sessionId: "d81eb2",
            location: "EditPostPage.jsx:useEffect",
            message: "edit load: calling getPostById",
            data: { postId, hypothesisId: "A", runId: "post-fix" },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        const p = await getPostById(postId);
        // #region agent log
        fetch("http://127.0.0.1:7869/ingest/e2d441e0-ed91-4df0-a430-b8cf821f258a", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "d81eb2",
          },
          body: JSON.stringify({
            sessionId: "d81eb2",
            location: "EditPostPage.jsx:useEffect",
            message: "edit load: getPostById resolved",
            data: {
              hasPost: Boolean(p),
              hypothesisId: "A",
              runId: "post-fix",
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        if (cancelled || !p) return;
        setTitle(p.postTitle ?? "");
        setBody(p.postContent ?? "");
      } catch (e) {
        // #region agent log
        fetch("http://127.0.0.1:7869/ingest/e2d441e0-ed91-4df0-a430-b8cf821f258a", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "d81eb2",
          },
          body: JSON.stringify({
            sessionId: "d81eb2",
            location: "EditPostPage.jsx:useEffect",
            message: "edit load: error",
            data: {
              err: String(e?.message),
              hypothesisId: "A",
              runId: "post-fix",
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        if (!cancelled) setLoadError(e.message || "Không tải được bài viết.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

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
      setSubmitError("Bạn cần đăng nhập để lưu bài.");
      return;
    }
    setSubmitting(true);
    try {
      await updatePost(userId, postId, {
        postTitle: title.trim(),
        postContent: body.trim(),
        status: "ACTIVE",
      });
      navigate(`/posts/${postId}`);
    } catch (err) {
      setSubmitError(err.message || "Lưu bài thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div
        className="edit-post"
        data-name="Chỉnh sửa bài viết"
        data-node-id="28:31"
      >
        <header className="edit-post__header">
          <div className="edit-post__header-inner">
            <h1 className="edit-post__community">Cộng đồng</h1>
          </div>
        </header>
        <main className="edit-post__main">
          <p className="edit-post__load-msg">Đang tải bài viết…</p>
        </main>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className="edit-post"
        data-name="Chỉnh sửa bài viết"
        data-node-id="28:31"
      >
        <header className="edit-post__header">
          <div className="edit-post__header-inner">
            <h1 className="edit-post__community">Cộng đồng</h1>
          </div>
        </header>
        <main className="edit-post__main">
          <p
            className="edit-post__load-msg edit-post__load-msg--error"
            role="alert"
          >
            {loadError}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div
      className="edit-post"
      data-name="Chỉnh sửa bài viết"
      data-node-id="28:31"
    >
      <header className="edit-post__header" data-node-id="28:32">
        <div className="edit-post__header-inner">
          <h1 className="edit-post__community" data-node-id="I28:32;11:57">
            Cộng đồng
          </h1>
          <button
            type="submit"
            form={FORM_ID}
            className="edit-post__submit-header"
            data-node-id="I28:32;11:106;11:103"
            disabled={submitting}
          >
            {submitting ? "Đang lưu…" : "Lưu bài viết"}
          </button>
        </div>
      </header>

      <main className="edit-post__main">
        <form
          id={FORM_ID}
          className="edit-post__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="edit-post__card" data-node-id="28:71">
            {submitError ? (
              <p className="edit-post__form-error" role="alert">
                {submitError}
              </p>
            ) : null}

            <div
              className="edit-post__title-zone"
              data-name="Component 9"
              data-node-id="48:33"
            >
              <label className="edit-post__title-label" htmlFor={titleId}>
                Chỉnh sửa bài viết của bạn ngay
              </label>
              <input
                id={titleId}
                name="title"
                className="edit-post__title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhâp tiêu đề ấn tượng của bạn..."
                autoComplete="off"
                disabled={submitting}
              />
            </div>

            <div
              className="edit-post__body-zone"
              data-name="Component 10"
              data-node-id="48:34"
            >
              <div className="edit-post__divider" aria-hidden>
                <img src="/posts/editor-line.png" alt="" />
              </div>
              <label className="edit-post__visually-hidden" htmlFor={bodyId}>
                Nội dung bài viết
              </label>
              <textarea
                id={bodyId}
                name="body"
                className="edit-post__body-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Bắt đầu viết nội dung bài viết của bạn..."
                rows={14}
                disabled={submitting}
              />
              <p
                className={`edit-post__notice ${overLimit ? "edit-post__notice--warn" : ""}`}
              >
                {"Chú ý:  Nội dung bài viết giới hạn 1000 từ."}
                {body.trim() ? (
                  <span className="edit-post__word-count">
                    {" "}
                    ({wordCount}/1000)
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
