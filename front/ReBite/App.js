import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import UserView from './src/UserView';
import MerchantView from './src/MerchantView';
import AdminView from './src/AdminView';

// ⚠️ 重要：請將此處替換為你電腦的 IPv4 地址 (例如 192.168.1.100)
// 在終端機輸入 ipconfig 即可查到
const BASE_URL = 'http://10.0.0.117/ReBite/server';

export default function App() {
  const [role, setRole] = useState('visitor'); 
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  const isPasswordValid = (pass) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(pass);

  // 🛰️ 核心連線函式
  const handleAuth = async () => {
    // 基礎格式驗證
    if (!email || !password) return Alert.alert("提醒", "請填寫完整資訊");
    if (!validateEmail(email)) return Alert.alert("格式錯誤", "電子郵件格式不正確");
    if (!isPasswordValid(password)) return Alert.alert("格式錯誤", "密碼需為 8-16 位英數字組合");
    if (!isLogin && password !== confirmPassword) return Alert.alert("驗證失敗", "兩次輸入的密碼不一致");

    const endpoint = isLogin ? 'login.php' : 'register.php';
    
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        if (isLogin) {
          // 登入成功：依照資料庫回傳的 role 切換介面
          setRole(result.role); 
        } else {
          // 註冊成功：彈出提示並跳回登入
          Alert.alert("註冊成功", "帳號已建立，請重新登入", [
            { text: "確定", onPress: () => { setIsLogin(true); setPassword(''); setConfirmPassword(''); } }
          ]);
        }
      } else {
        Alert.alert("失敗", result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("連線錯誤", "無法連接伺服器。請檢查：\n1. 電腦 IP 是否正確\n2. 手機與電腦是否連同一個 Wi-Fi\n3. XAMPP 是否啟動");
    }
  };

  const showDevMenu = () => {
    Alert.alert("開發者選單", "切換終端測試:", [
      { text: "店家端", onPress: () => setRole('merchant') },
      { text: "管理端", onPress: () => setRole('admin') },
      { text: "取消", style: "cancel" }
    ]);
  };

  const renderContent = () => {
    if (role === 'user') return <UserView onLogout={() => setRole('visitor')} />;
    if (role === 'merchant') return <MerchantView onLogout={() => setRole('visitor')} />;
    if (role === 'admin') return <AdminView onLogout={() => setRole('visitor')} />;

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.loginContainer}>
        <View style={styles.logoSection}>
          <TouchableOpacity onLongPress={showDevMenu} activeOpacity={0.8}>
            <View style={styles.logoIconBg}><Text style={{fontSize: 30}}>🍃</Text></View>
          </TouchableOpacity>
          <Text style={styles.logoTitle}>ReBite</Text>
          <Text style={styles.logoSubtitle}>每一口都在拯救地球</Text>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tab, isLogin && styles.activeTab]} onPress={() => setIsLogin(true)}>
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>登入</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, !isLogin && styles.activeTab]} onPress={() => setIsLogin(false)}>
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>註冊</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>電子郵件</Text>
            <TextInput style={styles.input} placeholder="example@mail.com" placeholderTextColor="#CCC" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            
            <Text style={styles.inputLabel}>密碼</Text>
            <TextInput style={styles.input} placeholder="請輸入密碼" placeholderTextColor="#CCC" secureTextEntry value={password} onChangeText={setPassword} />

            <Text style={[styles.pwdHint, password.length > 0 && (isPasswordValid(password) ? styles.validHint : styles.invalidHint)]}>
              {isPasswordValid(password) ? '✓ 密碼格式正確' : '⚠ 需為 8-16 位英數字混合'}
            </Text>

            {!isLogin && (
              <View>
                <Text style={styles.inputLabel}>確認密碼</Text>
                <TextInput style={styles.input} placeholder="請再次輸入密碼" placeholderTextColor="#CCC" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <Text style={[styles.pwdHint, styles.invalidHint, {marginTop: -10}]}>⚠ 密碼不一致</Text>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.mainBtn} onPress={handleAuth}>
              <Text style={styles.mainBtnText}>{isLogin ? '登入' : '建立帳號'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  return <SafeAreaView style={{flex: 1, backgroundColor: '#F2EFED'}}>{renderContent()}</SafeAreaView>;
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  logoSection: { alignItems: 'center', marginBottom: 35 },
  logoIconBg: { width: 65, height: 65, backgroundColor: '#3D5A45', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  logoTitle: { fontSize: 34, fontWeight: 'bold', color: '#3D5A45', letterSpacing: 1 },
  logoSubtitle: { fontSize: 14, color: '#888', marginTop: 5 },
  loginCard: { backgroundColor: '#FFF', width: '100%', borderRadius: 30, padding: 25, elevation: 5 },
  tabRow: { flexDirection: 'row', marginBottom: 25, backgroundColor: '#F8F9FA', borderRadius: 15, padding: 5 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { color: '#AAA', fontWeight: '600' },
  activeTabText: { color: '#3D5A45' },
  form: { width: '100%' },
  inputLabel: { fontSize: 14, color: '#3D5A45', fontWeight: '600', marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: '#F8F9FA', height: 50, borderRadius: 15, paddingHorizontal: 20, marginBottom: 15, fontSize: 16 },
  pwdHint: { fontSize: 12, color: '#AAA', marginTop: -10, marginBottom: 15, marginLeft: 5 },
  invalidHint: { color: '#FF4D4D', fontWeight: 'bold' },
  validHint: { color: '#28a745' },
  mainBtn: { backgroundColor: '#3D5A45', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  mainBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
});