import * as React from 'react';

import { iPage } from './PageStore';
import { CB } from 'eexchange';
import eexchange from 'eexchange';

interface PROPS {
}

interface STATE {
    page?: iPage;
}
export class Page extends React.Component<PROPS, STATE> {
    constructor(props: PROPS) {
        super(props);

        this.state = { page: undefined };
        
        this.pageLoadedCallback = this.pageLoadedCallback.bind(this);
    }

    pageLoadedCallback: CB<iPage> = (t) => {
        this.setState({ page: t.data });
    };
    async componentDidMount() {
        eexchange.subscribeEvent(['page-loaded'], this.pageLoadedCallback);

        // для случая когда контент загрузился до монтирования страницы (например, SSR) сигнализируем что нам надо бы последнюю страницу кинуть
        // должно прекрасно сработать и если отмонтировать страницу, а затем ее заново примонтировать (например показать какое то системное сообщение, а затем вернуть страницу)
        eexchange.raiseEvent({ initiator: this, name: 'page-mounted' });
    }

    async componentWillUnmount() {
        eexchange.unsubscribeEvent(['page-loaded'], this.pageLoadedCallback);
    }

    render(): React.ReactNode {
        return <div className="" style={{ display: 'block' }}>

            {typeof this.state.page?.error == 'undefined' ? this.state.page?.content : 'Error: ' + this.state.page?.error}
        </div>;
    }
}