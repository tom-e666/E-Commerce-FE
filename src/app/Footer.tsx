'use client'
import { useRouter } from "next/navigation";

const Footer = () => {
    const FooterData = [{
        head: "Về GearnVn",
        choices: [{ title: "Giới thiệu", href: "#" }, { title: "Tuyển dụng", href: "#" }, { title: "Liên hệ", href: "#" }]
    }, {
        head: "Chính sách",
        choices: [{ title: "Giới thiệu", href: "#" }, { title: "Tuyển dụng", href: "#" }, { title: "Liên hệ", href: "#" }]
    }, {
        head: "Thông tin",
        choices: [{ title: "Giới thiệu", href: "#" }, { title: "Tuyển dụng", href: "#" }, { title: "Liên hệ", href: "#" }]
    }, {
        head:
            <>
                Tổng đài hỗ trợ <span className=" font-normal">(8:00 - 21:00)</span>
            </>,
        choices: [{ title: "Mua hàng: 1900.5301", href: "#" }, { title: "Bảo hành: 1900.5301", href: "#" }, { title: "Khiếu nại: 1900.5301", href: "#" }]
    },]
    const router = useRouter();
    return (
        <div className="bottom-0 w-screen overflow-x-hidden">
            <div className="flex-row gap-24 bg-white text-black flex justify-center">
                {FooterData.map((item, key) => (<div key={key} className="flex flex-col gap-1">
                    <div className="font-medium ">{item.head}</div>
                   
                    {item.choices.map((subitem, key) => (<div className="hover:text-blue-500 text-sm " key={key} onClick={() => {
                        router.push(subitem.href)
                    }}>
                        {subitem.title}
                    </div>))}
                </div>))}
            </div>
            <div className="flex flex-col-3 bg-blue-400">
                <div>Connect with us</div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}
export default Footer;