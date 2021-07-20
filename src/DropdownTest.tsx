import * as React from 'react';
import { CB } from 'eexchange';
import eexchange from 'eexchange';

export interface iDropdownProps {
    isopen?: boolean;
    title: React.ReactNode;
    body: React.ReactNode;
}

export interface iDropdownState {
    isopen: boolean;
}

export abstract class Dropdown<PROP extends iDropdownProps, STATE extends iDropdownState> extends React.Component<PROP, STATE> {

    abstract getStateFromProps(props: PROP): STATE;

    constructor(props: PROP) {
        super(props);

        this.state = this.getStateFromProps(props);

        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.toggle = this.toggle.bind(this);

        this.subscribeOpenDropdownCallback = this.subscribeOpenDropdownCallback.bind(this);
    }

    async componentDidMount() {
        eexchange.subscribeEvent(['open-dropdown', 'click-body'], this.subscribeOpenDropdownCallback);
    }

    async componentWillUnmount() {
        eexchange.unsubscribeEvent(['open-dropdown', 'click-body'], this.subscribeOpenDropdownCallback);
    }

    subscribeOpenDropdownCallback: CB<void> = (t) => {
        if (!this.state.isopen) return; // ignore all events when is closed

        if (t.name === 'click-body') {
            // some usefull code
            // ...
            console.log('log to console when is opened');
            this.close();
            return;
        }

        if (t.initiator !== this) this.close();
    };

    toggle(event: React.MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        if (this.state.isopen) { this.close(); } else { this.open(); }
        return false;
    }

    close() {
        this.setState({ isopen: false });
    }

    open() {
        this.setState({ isopen: true });

        eexchange.raiseEvent({ initiator: this, name: 'open-dropdown' });
    }


    abstract render(): React.ReactNode;
}

export class DropdownTest extends Dropdown<iDropdownProps, iDropdownState> {
    getStateFromProps(props: iDropdownProps): iDropdownState {
        return { isopen: props.isopen || false };
    }

    render(): React.ReactNode {
        return <div className="" style={{ display: 'block', float: 'left', marginRight: '30px' }}>
            <a href="#" style={{ color:'#fff'}} onClick={this.toggle}>{this.props.title}</a>
            <div style={{ display: this.state.isopen ? 'block' : 'none', position: 'absolute', backgroundColor: '#fff', color:'#000', padding: '20px 5' }}>{this.props.body}</div>
        </div>;
    }
}