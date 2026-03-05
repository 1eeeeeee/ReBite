import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, Image, 
  TouchableOpacity, TextInput, SafeAreaView, Modal 
} from 'react-native';

const UserView = ({ onLogout }) => {
  const [cartVisible, setCartVisible] = useState(false);
  const [cart, setCart] = useState([]);

  // 模擬商品數據
  const products = [
    { id: 1, name: '歐式酸種麵包組合', shop: 'Green Bakery', price: 88, originalPrice: 220, carbon: 1.2, category: '烘焙', img: 'https://via.placeholder.com/150' },
    { id: 2, name: '嫩雞藜麥溫沙拉', shop: 'Pure Food', price: 70, originalPrice: 180, carbon: 0.8, category: '沙拉', img: 'https://via.placeholder.com/150' },
    { id: 3, name: '日式照燒雞腿便當', shop: '日和食堂', price: 95, originalPrice: 150, carbon: 1.5, category: '主食', img: 'https://via.placeholder.com/150' },
    { id: 4, name: '手工草莓塔 (2入)', shop: 'Sweet Moment', price: 120, originalPrice: 300, carbon: 0.5, category: '甜點', img: 'https://via.placeholder.com/150' },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`已將 ${item.name} 加入救食清單`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 頂部導覽列 */}
      <View style={styles.header}>
        <Text style={styles.logoText}>ReBite</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCartVisible(true)}>
            <Text>🛒 ({cart.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onLogout}>
            <Text>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {/* 搜尋欄 */}
        <TextInput style={styles.searchBar} placeholder="探索附近的惜食品..." />

        {/* 分類標籤 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {['全部', '主食', '烘焙', '甜點', '沙拉'].map((cat, i) => (
            <TouchableOpacity key={i} style={[styles.catTag, i === 0 && styles.catTagActive]}>
              <Text style={i === 0 ? styles.catTagTextActive : styles.catTagText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 減碳成就卡片 */}
        <View style={styles.achievementCard}>
          <View>
            <Text style={styles.achieveTitle}>惜食成就</Text>
            <Text style={styles.achieveValue}>減碳 12.4kg</Text>
          </View>
          <Text style={styles.saveMoney}>累計節省 $ 2840</Text>
        </View>

        {/* 商品列表 */}
        <View style={styles.productGrid}>
          {products.map(item => (
            <View key={item.id} style={styles.prodCard}>
              <Image source={{ uri: item.img }} style={styles.prodImg} />
              <View style={styles.prodInfo}>
                <Text style={styles.shopName}>{item.shop}</Text>
                <Text style={styles.prodName}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>$ {item.price}</Text>
                  <Text style={styles.oldPrice}>$ {item.originalPrice}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 購物車 Modal (救食清單) */}
      <Modal visible={cartVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.cartSheet}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>🥗 救食清單</Text>
              <TouchableOpacity onPress={() => setCartVisible(false)}>
                <Text style={{fontSize: 20}}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{flex: 1}}>
              {cart.map((item, index) => (
                <View key={index} style={styles.cartItem}>
                  <Text>{item.name}</Text>
                  <Text>$ {item.price}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.cartFooter}>
              <Text style={styles.totalText}>合計金額: $ {cart.reduce((sum, i) => sum + i.price, 0)}</Text>
              <TouchableOpacity style={styles.checkoutBtn} onPress={() => alert('訂單已送出！取貨編號：RB' + Math.floor(Math.random()*1000))}>
                <Text style={styles.checkoutBtnText}>確認下單 (QR Code 取貨) ❯</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#3D5A45' },
  headerIcons: { flexDirection: 'row', gap: 15 },
  container: { paddingHorizontal: 15 },
  searchBar: { backgroundColor: '#FFF', padding: 12, borderRadius: 25, marginBottom: 15, elevation: 1 },
  categoryScroll: { marginBottom: 20 },
  catTag: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10 },
  catTagActive: { backgroundColor: '#3D5A45' },
  catTagTextActive: { color: '#FFF' },
  achievementCard: { backgroundColor: '#3D5A45', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  achieveTitle: { color: '#A9C0B0', fontSize: 12 },
  achieveValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  saveMoney: { color: '#FFF', fontSize: 18 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  prodCard: { backgroundColor: '#FFF', width: '48%', borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 2 },
  prodImg: { width: '100%', height: 120 },
  prodInfo: { padding: 10 },
  shopName: { fontSize: 10, color: '#999' },
  prodName: { fontSize: 14, fontWeight: '600', marginVertical: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  price: { fontSize: 16, color: '#3D5A45', fontWeight: 'bold' },
  oldPrice: { fontSize: 12, color: '#CCC', textDecorationLine: 'line-through' },
  addBtn: { position: 'absolute', right: 10, bottom: 10, backgroundColor: '#3D5A45', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#FFF', fontSize: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  cartSheet: { backgroundColor: '#F9F9F4', height: '70%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cartTitle: { fontSize: 20, fontWeight: 'bold' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  cartFooter: { paddingTop: 20 },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  checkoutBtn: { backgroundColor: '#3D5A45', padding: 18, borderRadius: 15, alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default UserView;