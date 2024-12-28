// Make sure this is the first line
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
        let weightedScore = 0;
        let totalWeight = subParams.reduce((sum, sub) => sum + sub.weight, 0);
        
        if (totalWeight === 0) return 0;
        
        subParams.forEach(sub => {
            const weightPercentage = sub.weight / totalWeight;
            weightedScore += sub.score * weightPercentage;
        });
        
        return Math.round(weightedScore * 10) / 10;
    };

    const addParameter = () => {
        const newId = Date.now().toString();
        setParameters(prev => [...prev, {
            id: newId,
            name: 'New Category',
            threshold: 3,
            instruction: '',
            category: '',
            subParameters: [{
                id: `${newId}-1`,
                name: 'New Sub-Parameter',
                score: 5,
                weight: 50,
                threshold: 3,
                instruction: ''
            }]
        }]);
    };

    const deleteParameter = (id) => {
        setParameters(prev => prev.filter(param => param.id !== id));
    };

    const updateParameterName = (id, newName) => {
        setParameters(prev => prev.map(param =>
            param.id === id ? { ...param, name: newName } : param
        ));
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
                        sub.id === subId ? { ...sub, [field]: field === 'score' || field === 'threshold' ? parseInt(value) : value } : sub
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
            e('div', { className: 'flex gap-4' }, [
                isEditing && e('button', {
                    onClick: addParameter,
                    className: 'bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                }, 'Add Category'),
                e('button', {
                    onClick: () => setIsEditing(!isEditing),
                    className: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                }, isEditing ? 'Done' : 'Edit')
            ])
        ]),

        // Parameters
        ...parameters.map(param => 
            e('div', { 
                key: param.id,
                className: 'bg-white rounded-lg shadow-md p-6 mb-6'
            }, [
                // Parameter Header
                e('div', { className: 'flex justify-between items-center mb-4' }, [
                    e('div', { className: 'flex-1' }, [
                        isEditing ? 
                            e('input', {
                                type: 'text',
                                value: param.name,
                                onChange: (e) => updateParameterName(param.id, e.target.value),
                                className: 'text-xl font-semibold w-full p-2 border rounded'
                            }) :
                            e('h2', { className: 'text-xl font-semibold' }, param.name),
                        e('div', { className: 'text-gray-600 mt-1' }, 
                            `Score: ${calculateParentScore(param.subParameters)}`
                        )
                    ]),
                    isEditing && e('button', {
                        onClick: () => deleteParameter(param.id),
                        className: 'ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
                    }, 'Delete')
                ]),

                // Sub Parameters
                e('div', { className: 'space-y-4' },
                    param.subParameters.map(sub => {
                        const isBelowThreshold = sub.score <= sub.threshold;
                        return e('div', { 
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
                                ]),
                                e('div', { className: 'flex gap-4' }, [
                                    e('input', {
                                        type: 'number',
                                        value: sub.threshold,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'threshold', e.target.value),
                                        className: 'w-24 p-2 border rounded',
                                        min: '1',
                                        max: '5',
                                        placeholder: 'Threshold'
                                    })
                                ])
                            ]) :
                            e('div', { className: 'flex justify-between items-center' }, [
                                e('span', { className: 'text-lg' }, `${sub.name} (${sub.weight}%)`),
                                e('select', {
                                    value: sub.score,
                                    onChange: (e) => updateSubParameter(param.id, sub.id, 'score', e.target.value),
                                    className: `ml-4 p-2 border rounded bg-white ${
                                        isBelowThreshold ? 'text-red-600 border-red-300' : 'text-green-600 border-green-300'
                                    }`
                                }, [1,2,3,4,5].map(n => 
                                    e('option', { key: n, value: n }, n)
                                ))
                            ])
                        );
                    })
                ),

                // Add Sub-Parameter Button
                isEditing && e('button', {
                    onClick: () => addSubParameter(param.id),
                    className: 'mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full'
                }, 'Add Sub-Parameter'),

                // Instructions for below threshold parameters
                !isEditing && param.subParameters.some(sub => sub.score <= sub.threshold) &&
                e('div', { className: 'mt-6 p-4 bg-red-50 rounded-lg border border-red-200' }, [
                    e('h3', { className: 'text-lg font-semibold text-red-700 mb-2' }, 'Required Actions:'),
                    e('ul', { className: 'space-y-2' },
                        param.subParameters
                            .filter(sub => sub.score <= sub.threshold)
                            .map(sub => 
                                e('li', { 
                                    key: sub.id,
                                    className: 'text-red-600'
                                }, [
                                    e('span', { className: 'font-medium' }, `${sub.name}: `),
                                    sub.instruction || 'No instruction provided'
                                ])
                            )
                    )
                ])
            ])
        )
    ]);
};

// Initialize the app
ReactDOM.render(e(App), document.getElementById('root'));
