import { config } from 'dotenv';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

config();

const SCOPES: string[] = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

class GoogleSheetService {
	private jwtFromEnv: any;
	private doc: any;

	constructor(id: string) {
		if (!id) {
			throw new Error("ID_UNDEFINED");
		}

		this.jwtFromEnv = new JWT({
			email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			scopes: SCOPES,
		});

		this.doc = new GoogleSpreadsheet(id, this.jwtFromEnv);
	}

	async getAllProducts(): Promise<any> {
		try {
			await this.doc.loadInfo();
			const sheet = this.doc.sheetsByIndex[0];
			if (!sheet) {
				console.warn(`Sheet at index 0 is undefined`);
				return null;
			}

			await sheet.loadCells("A2:C200");
			const rows = Math.min(sheet.rowCount, 200);
			console.log("Número de filas:", rows);

			let products: any[] = [];
			for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
				const productNameCell = sheet.getCell(rowIndex, 0);
				const productPriceCell = sheet.getCell(rowIndex, 2);

				if (
					!productNameCell ||
					!productPriceCell ||
					!productNameCell.value ||
					!productPriceCell.value
				) {
					continue;
				}

				products.push({
					NAME: productNameCell.value,
					PRICE: productPriceCell.value,
				});
			}
			return products;
		} catch (err) {
			console.error(err);
			return undefined;
		}
	}

	async saveOrder(data: any): Promise<any> {
		await this.doc.loadInfo();
    console.log('data from sheets', data);
		const sheet = this.doc.sheetsByIndex[1];
		console.log(sheet.title);
		try {
			const order = await sheet.addRow({
				name: data.name,
				email: data.email,
				identification: data.identification,
				cellphone: data.cellphone,
				orderItems: JSON.stringify(data.orderItems),
			});
			console.log("el order ha sido enviado", order);
			return order;
		} catch (error) {
			throw error;
		}
	}
}

export default GoogleSheetService;
