import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Alert, Image, Dimensions 
} from 'react-native';
import UserView from './src/UserView';
import MerchantView from './src/MerchantView';
import AdminView from './src/AdminView';
import { Video, ResizeMode } from 'expo-av'; // 導入影片組件

const { width, height } = Dimensions.get('window');
const BASE_URL = 'http://10.0.0.117/ReBite/server';

export default function App() {
  const [showSplash, setShowSplash] = useState(true); // 控制啟動動畫狀態
  const [role, setRole] = useState('visitor'); 
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  const isPasswordValid = (pass) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(pass);

  // 📹 處理影片播放狀態
  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setShowSplash(false); // 影片播完後關閉 Splash 畫面
    }
  };

  const handleAuth = async () => {
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
          // 🔑 核心邏輯：依照資料庫回傳的 role 切換介面
          setRole(result.role); 
        } else {
          Alert.alert("註冊成功", "帳號已建立，請重新登入", [
            { text: "確定", onPress: () => { setIsLogin(true); setPassword(''); setConfirmPassword(''); } }
          ]);
        }
      } else {
        Alert.alert("失敗", result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("連線錯誤", "無法連線至伺服器");
    }
  };

  const renderContent = () => {
    if (role === 'user') return <UserView onLogout={() => setRole('visitor')} />;
    if (role === 'merchant') return <MerchantView onLogout={() => setRole('visitor')} />;
    if (role === 'admin') return <AdminView onLogout={() => setRole('visitor')} />;

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.loginContainer}>
        {/* 修改這裡的結構：Logo 在上，文字在下且同一行 */}
        <View style={styles.logoSection}>
          <View style={styles.logoIconBg}>
            <Image source={require('./assets/images/logo.png')} style={styles.logoImage}/>
          </View>
          
          {/* 使用內聯樣式強制文字在同一行，不更動底下的 Styles */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.logoTitle}>ReBite</Text>
            <Text style={styles.logoSubtitle}>  每一口都在拯救地球</Text>
          </View>
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

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Video
          source={require('./assets/images/logo.mp4')}
          style={{ width: width, height: height }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={(e) => {
            console.log("Video Error:", e);
            setShowSplash(false);
          }}
        />
      </View>
    );
  }

  return <SafeAreaView style={{flex: 1, backgroundColor: '#FCF8EC'}}>{renderContent()}</SafeAreaView>;
}

const styles = StyleSheet.create({
  // 啟動影片樣式
  splashContainer: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  fullScreenVideo: { width: width, height: height },

  // 登入頁面樣式
  loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  logoSection: { alignItems: 'center', marginBottom: 35 },
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
  
  logoIconBg: { 
    width: 120, 
    height: 75, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});