import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrashAlt, FaPlus, FaBars, FaMinus } from 'react-icons/fa';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { InputContainer } from '../ProcessManager';

const DragHandle = SortableHandle(() => <FaBars className="regular solid grab" />);

const Process = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #d7d7d7;
    &:last-child {
        border-bottom: none;
    }
    .grab {
        cursor: grab;
    }
`;

const Action = styled.div`
    display: flex;
    padding: 5px;
    border: ${props => props.showBorder && '1px solid #d7d7d7'};
    border-radius: 2px;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
`;

const ProcessDetail = ({ data, deleteProcess, addChildren, updateProcess }) => {
    const [showParentInp, toggleParentInp] = useState(false);
    const [parentInp, setParentInp] = useState(data.name);
    const [showInput, toggleInput] = useState(false);
    const [childInput, setChildInput] = useState('');

    return (
        <div className="fcol">
            <Process>
                <div className="detail frow center">
                    <Action className="margin-r-5">
                        <DragHandle />
                    </Action>
                    {!showParentInp ? (
                        <span className="regular" onClick={() => toggleParentInp(!showParentInp)}>
                            {data.name}
                        </span>
                    ) : (
                        <InputContainer
                            noBorder
                            autoFocus
                            value={parentInp}
                            onChange={e => setParentInp(e.target.value)}
                            onBlur={() => toggleParentInp(!showParentInp)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && e.target.value.length) {
                                    updateProcess(data, e.target.value.trim());
                                    toggleParentInp(!showParentInp);
                                }
                            }}
                        />
                    )}
                </div>
                <div className="actions frow align-items">
                    <Action showBorder className="margin-r-5">
                        <FaTrashAlt
                            className="regular solid pointer"
                            onClick={() => {
                                deleteProcess(data);
                            }}
                        />
                    </Action>
                    <Action showBorder>
                        {!showInput ? (
                            <FaPlus className="regular solid pointer" onClick={() => toggleInput(!showInput)} />
                        ) : (
                            <FaMinus className="regular solid pointer" onClick={() => toggleInput(!showInput)} />
                        )}
                    </Action>
                </div>
            </Process>
            {showInput && (
                <InputContainer
                    value={childInput}
                    onChange={e => setChildInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && e.target.value.length) {
                            addChildren(data, e.target.value.trim());
                            setChildInput('');
                        }
                    }}
                    placeholder="enter a child process"
                />
            )}
            {data.has_child &&
                data.children.map((x, idx) => (
                    <Process className="margin-l-20" key={idx}>
                        {x.name}
                    </Process>
                ))}
        </div>
    );
};

export default SortableElement(ProcessDetail);
