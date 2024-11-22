import React, { useEffect, useState } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faPeopleRoof } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
    useEffect(() => {
        const featureItems = document.querySelectorAll('.feature-item');

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        entry.target.classList.remove('visible'); // Bỏ lớp visible khi ra khỏi khung nhìn
                    }
                });
            },
            { threshold: 0.2 }
        );

        featureItems.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    const numDivs = 12; // Số lượng div nội dung
    const radius = 450; // Khoảng cách từ tâm đến các div

    const contents = [
        "Ghi lại mọi khoản thu chi một cách dễ dàng và tiện lợi",
        "Phân loại chi tiêu theo danh mục để dễ dàng theo dõi",
        "Đặt mục tiêu chi tiêu và theo dõi tiến độ",
        "Đồng bộ dữ liệu giao dịch tự động",
        "Hiểu rõ thói quen chi tiêu qua biểu đồ và báo cáo",
        "Không bỏ lỡ bất kỳ khoản thanh toán nào",
        "Quản lý chi tiêu chung với người thân",
        "Bảo vệ dữ liệu tài chính an toàn",
        "Tạo trải nghiệm cá nhân hóa",
        "Sử dụng trên điện thoại, máy tính bảng",
        "Kết nối với những người dùng khác",
        "Hỗ trợ giải đáp thắc mắc"
    ];

    // Tính toán vị trí cho mỗi div
    const divs = Array.from({ length: numDivs }, (_, index) => {
        const angle = (index * 30 * Math.PI) / 180; // Chuyển độ sang radian
        const x = radius * Math.cos(angle); // Tính toán tọa độ x
        const y = radius * Math.sin(angle); // Tính toán tọa độ y

        return { x, y };
    });

    useEffect(() => {
        const circleItems = document.querySelectorAll('.circle-item');

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        entry.target.classList.remove('visible'); // Bỏ lớp visible khi ra khỏi khung nhìn
                    }
                });
            },
            { threshold: 0.1 } // Thay đổi ngưỡng nếu cần
        );

        circleItems.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    const [showButton, setShowButton] = useState(false); // Trạng thái để hiển thị nút

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowButton(true); // Hiện nút khi cuộn xuống hơn 200px
            } else {
                setShowButton(false); // Ẩn nút khi ở đầu trang
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // Dọn dẹp sự kiện khi component bị hủy
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Cuộn mượt mà
        });
    };

    return (
        <div className="home">
            <div className="hero-section">
                <h1>Quản Lý Chi Tiêu Dễ Dàng Hơn Bao Giờ Hết!</h1>
                <p>Giải pháp hoàn hảo để theo dõi chi tiêu hàng ngày, lập ngân sách và nhận báo cáo chi tiết.</p>
            </div>
            <div className="features">
                <h1>Các Tính Năng Nổi Bật</h1>
                <div className="feature-list">
                    <div className="feature-item">
                        <h2><span className='feature-icon'><FontAwesomeIcon icon={faChartSimple} /></span> Quản lý danh mục chi tiêu</h2>
                        <p>Với tính năng Quản lý danh mục chi tiêu, bạn có thể dễ dàng phân loại các khoản chi tiêu hàng ngày vào các danh mục như Ăn uống, Giải trí, Di chuyển, và nhiều hơn nữa.</p>
                        <p>Từ đó, bạn sẽ có cái nhìn rõ ràng và chi tiết hơn về các khoản chi trong từng lĩnh vực, giúp bạn quản lý tài chính cá nhân hiệu quả hơn bao giờ hết!</p>
                    </div>
                    <div className="feature-item">
                        <h2><span className='feature-icon'><FontAwesomeIcon icon={faCoins} /></span> Thiết lập ngân sách</h2>
                        <p>Bạn có thể thiết lập ngân sách tổng cho toàn bộ chi tiêu hàng tháng. Với tính năng này, bạn sẽ luôn nắm bắt được mình đã chi bao nhiêu và còn bao nhiêu so với ngân sách.</p>
                        <p>Đừng lo lắng về việc 'vung tay quá trán' - ứng dụng sẽ giúp bạn luôn giữ ngân sách trong tầm kiểm soát!</p>
                    </div>
                    <div className="feature-item">
                        <h2><span className='feature-icon'><FontAwesomeIcon icon={faCircleExclamation} /></span> Cảnh báo khi vượt quá ngân sách</h2>
                        <p>Không cần phải lo lắng về việc chi tiêu quá mức! Tính năng Cảnh báo ngân sách sẽ gửi thông báo đến bạn khi bạn gần đạt ngưỡng ngân sách hoặc đã vượt quá.</p>
                        <p>Điều này giúp bạn điều chỉnh kịp thời và tránh những bất ngờ không mong muốn vào cuối tháng!</p>
                    </div>
                    <div className="feature-item">
                        <h2><span className='feature-icon'><FontAwesomeIcon icon={faCalendarDays} /></span> Báo cáo chi tiêu</h2>
                        <p>Tính năng Báo cáo chi tiêu mang đến cho bạn cái nhìn toàn cảnh về tình hình tài chính của mình. Thống kê chi tiết, biểu đồ trực quan và so sánh từng tháng sẽ giúp bạn hiểu rõ hơn về thói quen chi tiêu, từ đó đưa ra những điều chỉnh phù hợp để đạt được mục tiêu tài chính!</p>
                    </div>
                </div>
                <p className='one'>Focus on your business while PNP manages</p>
                <p className='two'>your expenses and bills.</p>
            </div>
            <div className='about'>
                <h1>Về PNP</h1>
                <p className='a1'>PNP là một tập đoàn công nghệ tài chính có tư duy tiến bộ, hướng đến mục tiêu hợp lý hóa quy trình thanh toán cho doanh nghiệp. Bằng cách cung cấp một nền tảng kết hợp tính dễ sử dụng với chức năng mạnh mẽ, chúng tôi trao quyền cho khách hàng điều hướng hoạt động tài chính của họ một cách hiệu quả, bất kể quy mô hay ngành nghề.</p>
                <div className='about-list'>
                    <div className='about-item'>
                        <h2><FontAwesomeIcon icon={faBullseye} className='icon' />Nhiệm vụ của chúng tôi</h2>
                        <p>Sứ mệnh của chúng tôi là cung cấp các giải pháp tài chính toàn diện và có thể tùy chỉnh giúp các doanh nghiệp phát triển mạnh mẽ trên thị trường toàn cầu ngày nay. Chúng tôi cam kết đơn giản hóa việc quản lý tài chính, đảm bảo khách hàng có thể tập trung vào tăng trưởng và đổi mới.</p>
                    </div>
                    <div className='about-item'>
                        <h2><FontAwesomeIcon icon={faUserGroup} className='icon' />Chúng tôi là ai</h2>
                        <p>Chúng tôi là một nhóm chuyên gia công nghệ tài chính tận tụy, hướng đến mục tiêu chuyển đổi cách các doanh nghiệp quản lý giao dịch của mình. Tại PNP, chúng tôi hiểu những thách thức khi hoạt động trong môi trường toàn cầu và chúng tôi nỗ lực cung cấp các giải pháp không chỉ hiệu quả mà còn thân thiện với người dùng.</p>
                    </div>
                    <div className='about-item'>
                        <h2><FontAwesomeIcon icon={faLightbulb} className='icon' />Tầm nhìn của chúng tôi</h2>
                        <p>Tầm nhìn của chúng tôi là trở thành nền tảng toàn cầu hàng đầu cho các dịch vụ tài chính, thúc đẩy sự đơn giản và khả năng tiếp cận trong thanh toán quốc tế. Chúng tôi mong muốn tạo ra một môi trường nơi các doanh nghiệp có thể phát triển mà không có sự phức tạp phiền toái thường gắn liền với các giao dịch tài chính.</p>
                    </div>
                    <div className='about-item'>
                        <h2><FontAwesomeIcon icon={faPeopleRoof} className='icon' />Chúng tôi làm gì</h2>
                        <p>Chúng tôi cung cấp một bộ công cụ quản lý tài chính toàn diện được thiết kế để tạo điều kiện thuận lợi cho các giao dịch trong nước và quốc tế, hỗ trợ thương hiệu tùy chỉnh và cung cấp thông tin chi tiết thông qua các khả năng quản lý dữ liệu tiên tiến. Nền tảng của chúng tôi phục vụ cụ thể cho nhu cầu của thương mại điện tử, người có sức ảnh hưởng và doanh nghiệp xuất nhập khẩu.</p>
                    </div>
                </div>
            </div>
            <div className='everything'>
                <h1>Bạn có thể làm nhiều thứ với PNP Tracker</h1>
                <div className='home-circles'>
                    <div className='circles'>
                        <div></div>
                        <div></div>
                        <div></div>
                        <span>PNP</span>
                    </div>
                    {divs.map((pos, index) => (
                        <div
                            key={index}
                            className="circle-item"
                            style={{
                                position: 'absolute',
                                transform: `translate(${pos.x}px, ${pos.y}px)`,
                            }}
                        >
                            {contents[index]} {/* Hiển thị nội dung tương ứng */}
                        </div>
                    ))}
                </div>
            </div>
            {showButton && (
                <button onClick={scrollToTop} className="back-to-top">
                    <FontAwesomeIcon icon={faArrowUp} /> {/* Thêm icon vào nút */}
                </button>
            )}
        </div>
    );
};

export default Home;
