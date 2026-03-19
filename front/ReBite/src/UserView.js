import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, Image, 
  TouchableOpacity, TextInput, SafeAreaView, Modal, Alert 
} from 'react-native';

// --- 1. 成就詳情視圖 (顯示北極熊與海冰) ---
const AchievementDetail = ({ onBack, totalCarbon }) => {
  // 模擬歷史取貨數據 (你可以根據實際下單情況增加)
  const historyData = [
    { id: '1', name: '歐式酸種麵包組合', carbon: 2.5, date: '2024/03/15', shop: 'Green Bakery' },
    { id: '2', name: '嫩雞藜麥溫沙拉', carbon: 1.8, date: '2024/03/12', shop: 'Pure Food' },
    { id: '3', name: '日式照燒雞腿便當', carbon: 4.2, date: '2024/03/10', shop: '日和食堂' },
  ];

  // 🌍 換算邏輯
  // 根據研究，每減少 1kg 碳排放，約可保護 3 平方公分的海冰
  const iceSaved = (totalCarbon * 30).toFixed(1); 

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backText}>❮ 返回</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>惜食成就</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.bearCard}>
          <Text style={styles.bearLabel}>已減碳</Text>
          <Text style={styles.bearValue}>{totalCarbon} <Text style={{fontSize: 20}}>kg</Text></Text>
          
          <View style={styles.whiteDivider} />
          
          <Text style={styles.bearGoalTitle}>🐻‍❄️ 你的努力讓地球降溫了：</Text>
          <View style={styles.factRow}>
            <View style={styles.factBox}>
              <Text style={{fontSize: 35}}>🧊</Text>
              <Text style={styles.factNum}>{iceSaved}</Text>
              <Text style={styles.factSub}>保護海冰 (cm²)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.historyTitle}>🍽️ 拯救成功的食物清單</Text>
        {historyData.map(item => (
          <View key={item.id} style={styles.historyItem}>
            <View>
              <Text style={styles.historyFood}>{item.name}</Text>
              <Text style={styles.historyShop}>{item.shop} • {item.date}</Text>
            </View>
            <View style={styles.carbonTag}>
              <Text style={styles.carbonTagText}>-{item.carbon}kg</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- 2. 主頁面 UserView ---
const UserView = ({ onLogout }) => {
  const [cartVisible, setCartVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // 控制切換成就頁
  const [cart, setCart] = useState([]);
  const [totalCarbon, setTotalCarbon] = useState(12.4); // 初始模擬數值

  const products = [
    { id: 1, name: '歐式酸種麵包組合', shop: 'Green Bakery', price: 88, originalPrice: 220, carbon: 1.2, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
    { id: 2, name: '嫩雞藜麥溫沙拉', shop: 'Pure Food', price: 70, originalPrice: 180, carbon: 0.8, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { id: 3, name: '日式照燒雞腿便當', shop: '日和食堂', price: 95, originalPrice: 150, carbon: 1.5, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { id: 4, name: '手工草莓塔 (2入)', shop: 'Sweet Moment', price: 120, originalPrice: 300, carbon: 0.5, img: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400' },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
    Alert.alert("加入成功", `已將 ${item.name} 加入救食清單`);
  };

  // 如果開啟了成就詳情，就渲染 AchievementDetail
  if (showDetail) {
    return <AchievementDetail onBack={() => setShowDetail(false)} totalCarbon={totalCarbon} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.logoText}>ReBite</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setCartVisible(true)}>
            <Text style={{fontSize: 22}}>🛒 ({cart.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Text style={{fontSize: 22}}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TextInput style={styles.searchBar} placeholder="探索附近的惜食品..." placeholderTextColor="#CCC" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {['全部', '主食', '烘培', '甜點', '沙拉'].map((cat, i) => (
            <TouchableOpacity key={i} style={[styles.catTag, i === 0 && styles.catActive]}>
              <Text style={i === 0 ? styles.catTextActive : styles.catText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 🌟 點擊這張綠色卡片就會跳轉到北極熊頁面 */}
        <TouchableOpacity style={styles.achCard} onPress={() => setShowDetail(true)}>
          <View>
            <Text style={styles.achLabel}>惜食成就</Text>
            <Text style={styles.achVal}>減碳 {totalCarbon}kg</Text>
          </View>
          <Text style={styles.achSave}>累計節省 $ 2840</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          {products.map(item => (
            <View key={item.id} style={styles.pCard}>
              <Image source={{ uri: item.img }} style={styles.pImg} />
              <View style={styles.pInfo}>
                <Text style={styles.pShop}>{item.shop}</Text>
                <Text style={styles.pName}>{item.name}</Text>
                <View style={styles.pPriceRow}>
                  <Text style={styles.pPrice}>$ {item.price}</Text>
                  <Text style={styles.pOld}>$ {item.originalPrice}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.pAdd} onPress={() => addToCart(item)}>
                <Text style={styles.pAddText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 購物車 Modal 略 (保持你原本的邏輯) */}
    </SafeAreaView>
  );
};

// --- 樣式表 ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF8EC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  logoText: { fontSize: 26, fontWeight: 'bold', color: '#3D5A45' },
  headerIcons: { flexDirection: 'row', gap: 20 },
  container: { paddingHorizontal: 20 },
  searchBar: { backgroundColor: '#FFF', padding: 15, borderRadius: 25, marginBottom: 20, elevation: 1 },
  catScroll: { marginBottom: 20 },
  catTag: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10 },
  catActive: { backgroundColor: '#3D5A45' },
  catText: { color: '#666' },
  catTextActive: { color: '#FFF', fontWeight: 'bold' },

  // 主頁成就卡片
  achCard: { backgroundColor: '#3D5A45', borderRadius: 25, padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 25 },
  achLabel: { color: '#A9C0B0', fontSize: 13, marginBottom: 5 },
  achVal: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  achSave: { color: '#FFF', fontSize: 16 },

  // 商品格線
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  pCard: { backgroundColor: '#FFF', width: '48%', borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  pImg: { width: '100%', height: 120 },
  pInfo: { padding: 12 },
  pShop: { fontSize: 10, color: '#999' },
  pName: { fontSize: 14, fontWeight: 'bold', marginVertical: 5 },
  pPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pPrice: { fontSize: 18, color: '#3D5A45', fontWeight: 'bold' },
  pOld: { fontSize: 12, color: '#BBB', textDecorationLine: 'line-through' },
  pAdd: { position: 'absolute', right: 10, bottom: 10, backgroundColor: '#3D5A45', width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  pAddText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

  // --- 成就詳情專用樣式 ---
  bearCard: { backgroundColor: '#3D5A45', borderRadius: 30, padding: 30, alignItems: 'center', marginTop: 10 },
  bearLabel: { color: '#A9C0B0', fontSize: 16 },
  bearValue: { color: '#FFF', fontSize: 55, fontWeight: 'bold', marginVertical: 10 },
  whiteDivider: { width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 25 },
  bearGoalTitle: { color: '#FFF', fontSize: 15, marginBottom: 20 },
  factRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  factBox: { alignItems: 'center' },
  factNum: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  factSub: { color: '#A9C0B0', fontSize: 11 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#3D5A45', marginTop: 30, marginBottom: 15 },
  historyItem: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  historyFood: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  historyShop: { fontSize: 12, color: '#999', marginTop: 4 },
  carbonTag: { backgroundColor: '#F0F5F1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  carbonTagText: { color: '#3D5A45', fontWeight: 'bold', fontSize: 12 },
  backText: { color: '#3D5A45', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#3D5A45' }
});

export default UserView;