import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deletePost, getAllPosts, getPostById } from "../../services/postService";
import {
  formatRelativeTime,
  getStoredUserId,
} from "../../store/slice/postUtils";
import "./ViewPostPage.css";

const ASSETS = {
  avatar: "/posts/avatar.png",
  heart: "/posts/icon-heart.png",
  comment: "/posts/icon-comment.png",
  menuDot: "/posts/icon-menu-dot.png",
};

export default function ViewPostPage() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState(null);
  const [list, setList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setLoading(true);

    async function run() {
      try {
        if (postId) {
          const p = await getPostById(postId);
          if (!cancelled) setPost(p);
        } else {
          const items = await getAllPosts();
          if (!cancelled) setList(Array.isArray(items) ? items : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Không tải được dữ liệu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const currentUserId = getStoredUserId();
  const authorId = post?.user?.id;
  const canEdit = Boolean(
    postId && currentUserId && authorId && currentUserId === authorId,
  );

  function isOwnPost(p) {
    if (!currentUserId || !p?.user?.id) return false;
    return String(currentUserId) === String(p.user.id);
  }

  async function handleDeletePost(id) {
    if (!window.confirm("Xóa bài viết này? Hành động không thể hoàn tác.")) {
      return;
    }
    const uid = getStoredUserId();
    if (!uid) {
      window.alert("Bạn cần đăng nhập để xóa bài.");
      return;
    }
    setDeletingId(id);
    try {
      await deletePost(uid, id);
      setList((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      window.alert(e.message || "Xóa bài thất bại.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="view-post" data-name="Xem bài viết" data-node-id="1:7">
      <header className="view-post__header" data-node-id="11:107">
        <div className="view-post__header-inner">
          <div className="view-post__header-left">
            <Link className="view-post__back" to="/">
              ← Về trang chủ
            </Link>
            <h1 className="view-post__community" data-node-id="11:57">
              <Link className="view-post__community-link" to="/posts">
                Cộng đồng
              </Link>
            </h1>
          </div>
          <Link
            className="view-post__create"
            to="/posts/create"
            data-node-id="11:103"
          >
            Tạo bài viết
          </Link>
        </div>
      </header>

      <main className="view-post__main">
        {loading ? (
          <p className="view-post__status">Đang tải…</p>
        ) : error ? (
          <p
            className="view-post__status view-post__status--error"
            role="alert"
          >
            {error}
          </p>
        ) : postId && post ? (
          <article
            className="view-post__card"
            data-name="Bài viết"
            data-node-id="11:58"
          >
            {canEdit ? (
              <Link
                className="view-post__menu"
                to={`/posts/${postId}/edit`}
                aria-label="Chỉnh sửa bài viết"
                data-node-id="11:68"
              >
                <span className="view-post__menu-dot" aria-hidden>
                  <img src={ASSETS.menuDot} alt="" width={7} height={7} />
                </span>
                <span className="view-post__menu-dot" aria-hidden>
                  <img src={ASSETS.menuDot} alt="" width={7} height={7} />
                </span>
                <span className="view-post__menu-dot" aria-hidden>
                  <img src={ASSETS.menuDot} alt="" width={7} height={7} />
                </span>
              </Link>
            ) : (
              <span
                className="view-post__menu view-post__menu--placeholder"
                aria-hidden
              />
            )}

            <div
              className="view-post__content"
              data-name="Nội dung bài viết"
              data-node-id="11:140"
            >
              <img
                className="view-post__avatar"
                src={ASSETS.avatar}
                alt=""
                width={100}
                height={100}
                data-node-id="11:59"
              />
              <p className="view-post__author" data-node-id="11:60">
                {post.user?.name ?? "Thành viên"}
              </p>
              <p className="view-post__time" data-node-id="11:61">
                {formatRelativeTime(post.updatedAt || post.createdAt)}
              </p>
              <p className="view-post__quote" data-node-id="11:69">
                {post.postTitle}
              </p>
              <p className="view-post__body" data-node-id="64:33">
                {post.postContent}
              </p>
            </div>

            <footer className="view-post__footer">
              <div
                className="view-post__stat view-post__stat--like"
                data-name="Tim"
                data-node-id="11:100"
              >
                <img
                  className="view-post__stat-icon"
                  src={ASSETS.heart}
                  alt=""
                  width={38}
                  height={31}
                  data-node-id="11:92"
                />
                <span className="view-post__stat-num" data-node-id="11:97">
                  {post.likesCount ?? 0}
                </span>
              </div>
              <div
                className="view-post__stat view-post__stat--comment"
                data-name="Bình luận"
                data-node-id="11:102"
              >
                <img
                  className="view-post__stat-icon"
                  src={ASSETS.comment}
                  alt=""
                  width={38}
                  height={34}
                  data-node-id="11:95"
                />
                <span className="view-post__stat-num" data-node-id="11:98">
                  {post.commentsCount ?? 0}
                </span>
              </div>
            </footer>
          </article>
        ) : !postId ? (
          <section className="view-post__feed" aria-label="Danh sách bài viết">
            {list.length === 0 ? (
              <p className="view-post__status">Chưa có bài viết nào.</p>
            ) : (
              <ul className="view-post__feed-list">
                {list.map((p) => {
                  const own = isOwnPost(p);
                  const busy = deletingId === p.id;
                  return (
                    <li key={p.id} className="view-post__feed-item">
                      <div className="view-post__feed-item-head">
                        <Link
                          className="view-post__feed-title"
                          to={`/posts/${p.id}`}
                        >
                          {p.postTitle || "(Không tiêu đề)"}
                        </Link>
                        {own ? (
                          <div
                            className="view-post__feed-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              className="view-post__feed-action view-post__feed-action--edit"
                              to={`/posts/${p.id}/edit`}
                            >
                              Chỉnh sửa
                            </Link>
                            <button
                              type="button"
                              className="view-post__feed-action view-post__feed-action--delete"
                              disabled={busy}
                              onClick={() => handleDeletePost(p.id)}
                            >
                              {busy ? "Đang xóa…" : "Xóa"}
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <p className="view-post__feed-meta">
                        {p.user?.name ?? "Thành viên"} ·{" "}
                        {formatRelativeTime(p.updatedAt || p.createdAt)}
                      </p>
                      <p className="view-post__feed-excerpt">
                        {(p.postContent || "").slice(0, 180)}
                        {(p.postContent || "").length > 180 ? "…" : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : (
          <p className="view-post__status">Không tìm thấy bài viết.</p>
        )}
      </main>
    </div>
  );
}
