import {Link} from 'react-router-dom';
import './main.less';

export default function Home() {
    return (
        <div className="console-bce-cms">
            欢迎使用console-bce-cms! <br />
            <Link to="/bce-console-cms/test">test</Link>
        </div>
    );
}

