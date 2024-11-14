export async function initDetail(params) {
    const type = params.type; // 'animal', 'habitat'
    const id = params.id;

    let module;

    switch (type) {
        case 'animal':
            module = await import('../modules/animal-detail/animal-detail.js');
            break;
        case 'habitat':
            module = await import('../modules/habitat-detail/habitat-detail.js');
            break;
        default:
            module = undefined;
    }

    if (module && module.initPage) {
        await module.initPage({ id });
    }
}