import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subName => {                  // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[subName].container);   // добавляем к таблице после (append) или до (prepend)

    }); 
    after.forEach(subName => {                             // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.append(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
    }); 

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {    
        onAction();// Просто вызываем onAction без аргументов
    });
    root.container.addEventListener('reset', () => {    
        setTimeout(onAction)// Просто вызываем onAction без аргументов
    });

    root.container.addEventListener('submit', (e) => {    
        e.preventDefault();
        // // Очистка поля при нажатии на кнопку clear
        // if (e.submitter?.name === 'clear' && e.submitter.dataset.field) {
        //     const field = e.target.querySelector(`[name="${e.submitter.dataset.field}"]`);
        //     if (field) {
        //         field.value = '';
        //         if (field.tagName === 'SELECT') field.selectedIndex = 0;
        //     }
        // }
        onAction(e.submitter);
    });

    // Обработка Enter в полях фильтрации
    root.container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.closest('.filter-row')) {
            e.preventDefault();
            onAction();
        }
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        
        const nextRows = data.map(item => { 
            const row = cloneTemplate(rowTemplate);
           
            Object.entries(item).forEach(([key, value]) => {
                if (row.elements[key]) {
                    row.elements[key].textContent = value;                    
                }
            });
            return row.container;
        })
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}