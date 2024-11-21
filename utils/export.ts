import ExcelJS from "exceljs";
import type { GptDescription } from "~/types";

interface ExportExcelOptions {
  ids: Array<number>;
  prompt_id?: string;
}

export const exportExcel = async (options: ExportExcelOptions) => {
  const body = clone(options);

  const response = await useFetch("/api/panel/export", {
    method: "POST",
    body,
  });

  if (!response.data.value) return;

  const { histories, groups } = response.data.value;
  const excelData: any[] = [];
  const headersSet = new Set<string>();

  headersSet.add("Ürün Adı");
  headersSet.add("Ürün Linki");

  let productCodeExists = false;
  let productSkuExists = false;

  for (const history of histories) {
    const castDescription = history.gpt_description as string;
    const description = JSON.parse(castDescription) as GptDescription;

    const rowData: { [key: string]: string[] } = {};

    rowData["Ürün Adı"] = [history.product_title.trim() || ""];
    rowData["Ürün Linki"] = [history.link || ""];

    if (history.product_code) {
      rowData["Ürün Kodu"] = [history.product_code];
      productCodeExists = true;
    }

    if (history.product_sku) {
      rowData["Ürün SKU"] = [history.product_sku];
      productSkuExists = true;
    }

    let fullDescription = "";
    let fullDescriptionHTML = "";

    for (const group of groups) {
      const groupName = group.name;
      headersSet.add(groupName);

      for (const key of group.prompt_keys) {
        const foundKey = description[key.key];
        if (!foundKey) continue;

        if (!rowData[groupName]) rowData[groupName] = [];
        rowData[groupName].push(foundKey.content);

        fullDescription += `${groupName.toUpperCase()}\n${cleanTags(foundKey.content)}\n\n`;
        fullDescriptionHTML += `<h3>${groupName.toUpperCase()}</h3><p>${cleanTags(foundKey.content)}</p>`;
      }
    }

    rowData["Tam Açıklama"] = [fullDescription.trim()];
    rowData["Tam Açıklama (HTML)"] = [fullDescriptionHTML.trim()];

    const formattedRowData: { [key: string]: string } = {};

    for (const groupName in rowData) {
      formattedRowData[groupName] = rowData[groupName].join("\n\n");
    }

    excelData.push(formattedRowData);
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Prompt Data");

  if (productCodeExists) headersSet.add("Ürün Kodu");
  if (productSkuExists) headersSet.add("Ürün SKU");

  headersSet.add("Tam Açıklama");
  headersSet.add("Tam Açıklama (HTML)");

  worksheet.columns = Array.from(headersSet).map((header) => ({
    header,
    key: header,
    width: 30,
  }));

  const file = options.prompt_id || "file";
  excelData.forEach((data) => worksheet.addRow(data));

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `export_${file}.xlsx`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
