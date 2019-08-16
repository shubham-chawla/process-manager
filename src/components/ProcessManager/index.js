import React, { useState } from 'react';
import styled from 'styled-components';
import { SortableContainer } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { getID } from '../../utils/helpers';
import ProcessDetail from '../ProcessDetail';

const Container = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
    max-height: 600px;
    overflow: auto;
    background: rgba(0, 0, 0, 0.4);
`;

export const InputContainer = styled.input`
    border: none;
    height: 50px;
    width: 100%;
    background-color: #fff;
    padding: 10px;
    font-size: 16px;
    border-bottom: ${props => !props.noBorder && '1px solid #d7d7d7'};
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 500px;
    height: 70px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #d7d7d7;
`;

const Button = styled.div`
    background-color: blue;
    color: #fff;
    width: 100%;
    height: 100%;
    font-size: 22px;
`;

const SortableList = SortableContainer(({ processes, deleteProcess, addChildren, updateProcess }) => (
    <div>
        {processes.map((x, i) => (
            <div key={i} index={i}>
                <ProcessDetail key={i} index={i} data={x} addChildren={addChildren} deleteProcess={deleteProcess} updateProcess={updateProcess} />
            </div>
        ))}
    </div>
));

const ProcessManager = () => {
    const [inputVal, setInputVal] = useState('');
    const [processes, makeProcess] = useState([]);
    const [myJSON, setJSON] = useState({});

    const addProcess = process => {
        makeProcess([{ id: getID('process'), name: process, has_child: false, children: [] }, ...processes]);
        setInputVal('');
    };

    const updateProcess = (process, value) => makeProcess(processes.map(x => (x.id === process.id ? { ...x, name: value } : x)));

    const addChildren = (process, value) => {
        makeProcess(processes.map(x => (x.id === process.id ? { ...x, has_child: true, children: [{ id: getID(x.id), name: value }, ...x.children] } : x)));
    };

    const deleteProcess = process => makeProcess(processes.filter(x => x.id !== process.id));

    const onSortEnd = ({ oldIndex, newIndex }) => makeProcess(arrayMove(processes, oldIndex, newIndex));

    return (
        <div className="ProcessManager max-width-container center margin-t-50 fcol">
            <h1 className="large">process manager</h1>
            <Container className="margin-t-20">
                <InputContainer
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && e.target.value.length) {
                            addProcess(e.target.value.trim());
                        }
                    }}
                    placeholder="create a new process"
                />
                {!!processes.length && (
                    <SortableList useDragHandle addChildren={addChildren} onSortEnd={onSortEnd} processes={processes} deleteProcess={deleteProcess} updateProcess={updateProcess} />
                )}
            </Container>
            {!!processes.length && (
                <ButtonContainer>
                    <Button className="center pointer" onClick={() => setJSON({ data: processes })}>
                        Create JSON
                    </Button>
                </ButtonContainer>
            )}
            <p className="margin-t-10">{JSON.stringify(myJSON)}</p>
        </div>
    );
};

export default ProcessManager;
