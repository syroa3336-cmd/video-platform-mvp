import FormData from 'form-data';
import axios from 'axios';

export async function uploadToDoodstream(fileBuffer, filename, apiKey) {
  if (!apiKey) throw new Error('DOODSTREAM_API_KEY missing');

  // 1. Sunucu adresi al
  const serverUrl = `https://doodapi.co/api/upload/server?key=${apiKey}`;
  const serverRes = await axios.get(serverUrl);
  const serverData = serverRes.data;
  if (serverData.status !== 200) throw new Error(`Server error: ${serverData.msg}`);
  const uploadUrl = serverData.result;

  // 2. Yükleme isteği
  const form = new FormData();
  form.append('file', fileBuffer, filename);
  // api_key'yi hem URL'ye hem de form-data'ya ekleyelim (denemek için)
  form.append('api_key', apiKey);

  const uploadRes = await axios.post(`${uploadUrl}?api_key=${apiKey}`, form, {
    headers: {
      ...form.getHeaders(),
      // Ekstra header gerekmez, axios zaten doğru ayarlar
    },
  });

  const uploadData = uploadRes.data;
  if (uploadData.status !== 200) throw new Error(`Upload error: ${uploadData.msg}`);
  const filecode = uploadData.result?.[0]?.filecode;
  if (!filecode) throw new Error('No filecode');
  console.log('✅ Filecode:', filecode);
  return { filecode };
}