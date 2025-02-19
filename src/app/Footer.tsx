'use client'
import {useRouter} from "next/navigation";

const Footer = () => {
    const FooterData = [{
        head: "About us",
        choices: [{title: "Gioi thieu", href: "#"}, {title: "Tuyen dung", href: "#"}, {title: "Lien he", href: "#"}]
    }, {
        head: "Chinh sach",
        choices: [{title: "Gioi thieu", href: "#"}, {title: "Tuyen dung", href: "#"}, {title: "Lien he", href: "#"}]
    }, {
        head: "Thong tin",
        choices: [{title: "Gioi thieu", href: "#"}, {title: "Tuyen dung", href: "#"}, {title: "Lien he", href: "#"}]
    }, {
        head: "Tong dai",
        choices: [{title: "Gioi thieu", href: "#"}, {
            title: "Tuyen dung <a>089924298</a>",
            href: "#"
        }, {title: "Lien he", href: "#"}]
    },]
    const router = useRouter();
    return (<>
            <div className="flex flex-row gap-24 bg-white text-black flex justify-center">
                {FooterData.map((item, key) => (<div key={key} className="flex flex-col gap-1">
                    <div className="font-bold">{item.head}</div>
                    {item.choices.map((subitem, key) => (<div className="hover:text-blue-500" key={key} onClick={() => {
                            router.push(subitem.href)
                        }}>
                            {subitem.title}
                        </div>))}
                </div>))}
            </div>
            <div className="flex flex-col-3">
                <div>Connect with us</div>
                <div></div>
                <div></div>
            </div>
        </>
    )
}
export default Footer;