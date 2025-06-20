import React from "react";

export default function HeroVideo() {
  return (
    <section id="videos" className="section">
      <div className="container">
        <h2>MVで見る農園の魅力</h2>
        <div className="video-preview">
          <div className="video-preview-content">
            <div className="video-preview-text">
              <h3>ミュージックビデオで紹介する魅力</h3>
              <p>
                農園での楽しい活動や奥多摩の魅力をミュージックビデオにてご紹介！<br />
                あなたのお気に入りの曲を見つけてね
              </p>
              <a href="mv.html" className="btn-video">
                MVを見る <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="video-preview-image">
              {/* <iframe src="https://drive.google.com/file/d/1S-bKH9-LBEr5w3-Q9veJMsAgEOpSDFyO/embed" width="100%" height="315" allow="autoplay"></iframe> */}
              <img
                data-src="images/MVサムネ/夢の小屋--サムネイル.jpg"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
                alt="動画プレビュー"
                style={{ width: "100%", height: "315px", objectFit: "cover" }}
                loading="lazy"
                decoding="async"
              />
              {/* <div className="play-overlay">
                  <i className="fas fa-play"></i>
                </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 