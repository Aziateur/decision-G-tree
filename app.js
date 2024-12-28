const e = React.createElement;

const App = () => {
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

    const calculateParentScore = (subParams) => {
        if (!subParams?.length) return 0;
        let totalScore = 0, totalWeight = 0;
        subParams.forEach(sub => {
            totalScore += (sub.score * sub.weight);
            totalWeight += sub.weight;
        });
        return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 0;
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

    return e('div', { className: 'container mx-auto p-4 max-w-3xl' }, [
        // Header
        e('div', { className: 'flex justify-between items-center mb-8' }, [
            e('h1', { className: 'text-4xl font-bold' }, 'Break Decision System'),
            e('button', {
                onClick: () => setIsEditing(!isEditing),
                className: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            }, isEditing ? 'Done' : 'Edit')
        ]),

        // Parameters
        ...parameters.map(param => 
            e('div', { 
                key: param.id,
                className: 'bg-white rounded-lg shadow-md p-6 mb-6'
            }, [
                // Parameter Header
                e('div', { className: 'flex justify-between items-center mb-4' }, [
                    e('div', null, [
                        e('h2', { className: 'text-xl font-semibold' }, param.name),
                        e('div', { className: 'text-gray-600 mt-1' }, 
                            `Score: ${calculateParentScore(param.subParameters)}`
                        )
                    ])
                ]),

                // Sub Parameters
                e('div', { className: 'space-y-4' },
                    param.subParameters.map(sub =>
                        e('div', { 
                            key: sub.id,
                            className: 'p-4 bg-gray-50 rounded-lg'
                        }, 
                            isEditing ?
                            e('div', { className: 'space-y-3' }, [
                                e('input', {
                                    type: 'text',
                                    value: sub.name,
                                    onChange: (e) => updateSubParameter(param.id, sub.id, 'name', e.target.value),
                                    className: 'w-full p-2 border rounded'
                                }),
                                e('div', { className: 'flex gap-4' }, [
                                    e('input', {
                                        type: 'number',
                                        value: sub.weight,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'weight', e.target.value),
                                        className: 'w-24 p-2 border rounded',
                                        min: '0',
                                        max: '100'
                                    }),
                                    e('input', {
                                        type: 'text',
                                        value: sub.instruction,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'instruction', e.target.value),
                                        className: 'flex-1 p-2 border rounded',
                                        placeholder: 'Instructions'
                                    })
                                ])
                            ]) :
                            e('div', { className: 'flex justify-between items-center' }, [
                                e('span', { className: 'text-lg' }, `${sub.name} (${sub.weight}%)`),
                                e('select', {
                                    value: sub.score,
                                    onChange: (e) => updateSubParameter(param.id, sub.id, 'score', e.target.value),
                                    className: 'ml-4 p-2 border rounded bg-white'
                                }, [1,2,3,4,5].map(n => 
                                    e('option', { key: n, value: n }, n)
                                ))
                            ])
                        )
                    )
                ),

                // Add Sub-Parameter Button
                isEditing && e('button', {
                    onClick: () => addSubParameter(param.id),
                    className: 'mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full'
                }, 'Add Sub-Parameter')
            ])
        )
    ]);
};

// Initialize the app
ReactDOM.render(e(App), document.getElementById('root'));
