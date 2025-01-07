const fs = require('fs-extra');
const Handlebars = require('handlebars');
const path = require('path');

// templates/variables フォルダ内の全JSONファイルを読み込み、1つのオブジェクトにマージする
const mergeData = (dir) => {
    const files = fs.readdirSync(dir);
    return files.reduce((acc, file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            return { ...acc, ...mergeData(filePath) };
        } else if (file.endsWith('.json')) {
            const fileData = fs.readJsonSync(filePath);
            const fileName = path.basename(file, '.json');
            return { ...acc, [fileName]: fileData };
        }
        return acc;
    }, {});
};
const data = mergeData(path.join(__dirname, 'templates/variables'));

// 入力テンプレートフォルダと出力フォルダ
const INPUT_FOLDER = './templates';
const OUTPUT_FOLDER = './dist';

async function compileTemplates() {
    try {
        // 出力フォルダを作り直し
        await fs.remove(OUTPUT_FOLDER);
        await fs.ensureDir(OUTPUT_FOLDER);

        // partsの登録
        const partialsDir = path.join(INPUT_FOLDER, 'parts');
        const partialFiles = fs.readdirSync(partialsDir);
        partialFiles.forEach(file => {
            const partialName = file.replace(/\\/g, '/').replace('.hbs', '');
            const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf-8');
            Handlebars.registerPartial(partialName, partialContent);
        });

        // 入力フォルダ内の全テンプレートを取得
        const files = fs.readdirSync(INPUT_FOLDER).filter(file => file.endsWith('.hbs'));

        files.forEach(file => {
            const templatePath = path.join(INPUT_FOLDER, file);
            const templateContent = fs.readFileSync(templatePath, 'utf-8');

            // テンプレートをコンパイル
            const template = Handlebars.compile(templateContent);

            // HTML出力
            const outputHTML = template(data);

            // 出力ファイルパスを生成
            const outputFileName = file.replace('.hbs', '.html');
            const outputPath = path.join(OUTPUT_FOLDER, outputFileName);

            // HTMLをファイルに書き出し
            fs.writeFileSync(outputPath, outputHTML, 'utf-8');

            console.log(`Compiled: ${templatePath} -> ${outputPath}`);
        });

        console.log('All templates compiled successfully!');
    } catch (err) {
        console.error('Error during compilation:', err);
    }
}

compileTemplates();
