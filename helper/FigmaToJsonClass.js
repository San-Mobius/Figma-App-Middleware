const { EventEmitter } = require("stream");

const { transform } = require('./extract');
const { saveAsJson } = require('./saveToFile');
const { exec } = require('child_process');

class FigmaToJsonClass extends EventEmitter {

    constructor( cb, pathToSaveJson = './designToken/' ) {
        super();
        this.pathToSaveJson = pathToSaveJson;
        this.cb = cb;
    }

    transformTokenToStyleDictionaryInput( designToken ) {
        let color = {
            'colors': {
                $type: 'color',
                ...transform(designToken.colors, {})
            }
        }
        let typography = {
            'typography': {
                $type: 'typography',
                ...transform(designToken.typography, {})
            }
        }
        let width = {
            'width': {
                $type: 'max-width',
                ...transform(designToken['max-width'], {})
            }
        }
        let container = {
            'container': {
                $type: 'container',
                ...transform(designToken.container, {})
            }
        }
        let spacing = {
            'spacing': {
                $type: 'spacing',
                ...transform(designToken.spacing, {})
            }
        }
        let border_radius = {
            'border-radius': {
                $type: 'border-radius',
                ...transform(designToken['border radius'], {})
            }
        }
        let shadow = {
            'shadow': {
                $type: 'shadow',
                ...transform(designToken.effect, {})
            }
        }
        let font = {
            'font' : {
                $type: 'typography',
                ...transform(designToken.font, {})
            }
        }
        // TODO: Fix the grid configuration
        let grid = {
            'grid' : {
                $type: 'grid',
                ...transform(designToken.grid, {})
            }
        }
        this.emit('transformCompleted', color, typography, width, container, spacing, border_radius, shadow, font, grid)
    }

    saveStyleDictionary( dictionaries, pathToStoreJson ) {
        dictionaries.forEach(dict=> {
            const OPTION = Object.keys(dict)[0]+'.json'
            saveAsJson( dict, pathToStoreJson+OPTION )
            console.log(`--> Json Save to ${pathToStoreJson + OPTION}`);
        })
        this.emit(`jsonCreated`)
    }

    executeStyleDictionaryBuild() {
        console.log(`--> Build Started`);
        exec('pnpm run build', { maxBuffer: 1024*1024*10} ,async (err, stdout, stderr)=> {
            if(err) {
                console.log('--', err)
                this.emit('build failed')
                return;
            }
            this.emit('build done')
        });        
    }

    initializeFlow() {
        this.on('transformCompleted', (...args) => {
            this.saveStyleDictionary(args, this.pathToSaveJson)
        })
        
        this.on('jsonCreated', () => {
            this.executeStyleDictionaryBuild();
        })
        
        this.on('build failed', ()=> {
            console.log('--> Build Failed')
        })
        
        this.on('build done', ()=> {
            console.log('--> Build Completed')
            if(this.cb) {
                this.cb();
            }
        })
        
    }
}

module.exports = { FigmaToJsonClass } 