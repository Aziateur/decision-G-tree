const e = React.createElement;

const App = () => {
    // Initial state
    const [parameters, setParameters] = React.useState([{
        id: '1',
        name: 'Energy Level',
        threshold: 3,
        instruction: 'Complete Energy Management SOP',
        category: 'Physical',
        subParameters: [{
            id: '1-1',
            name: 'Mental Energy',
            score: 5,
            weight: 50,
            threshold: 3,
            instruction: 'Complete Mental Energy Sub-SOP'
        }, {
            id: '1-2',
            name: 'Physical Energy',
            score: 5,
            weight: 50,
            threshold: 3,
            instruction: 'Complete Physical Energy Sub-SOP'
        }]
    }]);

    const [isEditing, setIsEditing] = React.useState(false);
    const [expandedParams, setExpandedParams] = React.useState({});

    // Save/Load from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('breakSystemParameters');
        if (saved) setParameters(JSON.parse(saved));
    }, []);

    React.useEffect(() => {
        localStorage.setItem('breakSystemParameters', JSON.stringify(parameters));
    }, [parameters]);

    // Core functions
    const calculateParentScore = (subParams) => {
        if (!subParams.length) return 0;
        let totalScore = 0, totalWeight = 0;
        subParams.forEach(sub => {
            totalScore += (sub.score * sub.weight);
            totalWeight += sub.weight;
        });
        return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 0;
    };

    // Action handlers
    const addParameter = () => {
        const newParam = {
            id: Date.now().toString(),
            name: 'New Parameter',
            threshold: 3,
            instruction: '',
            category: 'Other',
            subParameters: []
        };
        setParameters(prev => [...prev, newParam]);
    };

    const addSubParameter = (parentId) => {
        setParameters(prev => prev.map(param => {
            if (param.id === parentId) {
                return {
                    ...param,
                    subParameters: [...param.subParameters, {
                        id: `${parentId}-${Date.now()}`,
                        name: 'New Sub-Parameter',
                        score: 5,
                        weight: 50,
                        threshold: 3,
                        instruction: ''
                    }]
                };
            }
            return param;
        }));
    };

    const updateSubParameter = (parentId, subId, field, value) => {
        setParameters(prev => prev.map(param => {
            if (param.id === parentId) {
                return {
                    ...param,
                    subParameters: param.subParameters.map(sub =>
                        sub.id === subId ? { ...sub, [field]: field === 'score' ? parseInt(value) : value } : sub
                    )
                };
            }
            return param;
        }));
    };

    // Main render
    return e('div', { className: 'max-w-4xl mx-auto p-4' }, [
        // Header
        e('div', { className: 'mb-4 flex justify-between items-center', key: 'header' }, [
            e('h2', { className: 'text-xl font-bold' }, 'Break Decision System'),
            e('button', {
                onClick: () => setIsEditing(!isEditing),
                className: 'px-4 py-2 bg-blue-500 text-white rounded'
            }, isEditing ? 'Done' : 'Edit')
        ]),

        // Parameters
        ...parameters.map(param => 
            e('div', { key: param.id, className: 'parameter-card' }, [
                e('div', { className: 'flex justify-between' }, [
                    e('div', null, [
                        e('span', { className: 'font-bold' }, param.name),
                        e('span', { className: 'ml-2 text-gray-600' }, 
                            `Score: ${calculateParentScore(param.subParameters)}`
                        )
                    ]),
                    isEditing && e('button', {
                        onClick: () => addSubParameter(param.id),
                        className: 'px-2 py-1 bg-green-500 text-white rounded'
                    }, 'Add Sub-Parameter')
                ]),
                e('div', { className: 'mt-4' }, 
                    param.subParameters.map(sub =>
                        e('div', { key: sub.id, className: 'mb-2 p-2 border rounded' },
                            isEditing ? [
                                e('input', {
                                    type: 'text',
                                    value: sub.name,
                                    onChange: (e) => updateSubParameter(param.id, sub.id, 'name', e.target.value),
                                    className: 'w-full p-1 mb-2 border rounded'
                                }),
                                e('div', { className: 'flex gap-2' }, [
                                    e('input', {
                                        type: 'number',
                                        value: sub.weight,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'weight', e.target.value),
                                        className: 'w-20 p-1 border rounded',
                                        placeholder: 'Weight'
                                    }),
                                    e('input', {
                                        type: 'text',
                                        value: sub.instruction,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'instruction', e.target.value),
                                        className: 'flex-1 p-1 border rounded',
                                        placeholder: 'Instruction'
                                    })
                                ])
                            ] : [
                                e('div', { className: 'flex justify-between' }, [
                                    e('span', null, `${sub.name} (${sub.weight}%)`),
                                    e('select', {
                                        value: sub.score,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'score', e.target.value),
                                        className: 'p-1 border rounded'
                                    }, [1,2,3,4,5].map(n => 
                                        e('option', { key: n, value: n }, n)
                                    ))
                                ])
                            ]
                        )
                    )
                )
            ])
        )
    ]);
};

// Initial render
ReactDOM.render(e(App), document.getElementById('root'));
